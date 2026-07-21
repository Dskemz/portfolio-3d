/**
 * Hook pour gérer la communication postMessage parent <-> iframe
 * Avec validation, timeouts et gestion d'erreurs
 */

"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  IframeMessage,
  MessageParentToIframe,
  MessageIframeToParent,
} from "@/types/iframe-messages";
import {
  validateOrigin,
  validateParentMessage,
  validateIframeMessage,
  getAllowedOrigins,
} from "@/lib/security/validation";

type MessageHandler<T = unknown> = (payload: T) => void | Promise<void>;
type ErrorHandler = (error: Error) => void;

interface UseIframeMessengerOptions {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  onReady?: () => void;
  onError?: ErrorHandler;
  timeout?: number;
}

/**
 * Hook parent: envoie des messages à l'iframe et reçoit les réponses
 */
export function useIframeMessenger({
  iframeRef,
  onReady,
  onError,
  timeout = 10000,
}: UseIframeMessengerOptions) {
  const messageHandlersRef = useRef<Map<string, MessageHandler>>(new Map());
  const pendingMessagesRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const allowedOriginsRef = useRef<string[]>(getAllowedOrigins());

  /**
   * Envoyer un message à l'iframe
   */
  const send = useCallback(
    async <T,>(message: IframeMessage<T>) => {
      if (!iframeRef.current?.contentWindow) {
        throw new Error("iframe not available");
      }

      const targetOrigin = allowedOriginsRef.current[0] || "*";

      iframeRef.current.contentWindow.postMessage(message, targetOrigin);

      // Optionnel: attendre une réponse avec timeout
      return new Promise<void>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          pendingMessagesRef.current.delete(message.nonce || "");
          reject(new Error(`Message timeout after ${timeout}ms`));
        }, timeout);

        if (message.nonce) {
          pendingMessagesRef.current.set(message.nonce, timeoutId);
        }

        // Pour cette démo, on resolve tout de suite
        // En production, on attendrait un ACK depuis l'iframe
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    [iframeRef, timeout]
  );

  /**
   * S'enregistrer pour recevoir un type de message
   */
  const on = useCallback((type: string, handler: MessageHandler) => {
    messageHandlersRef.current.set(type, handler);

    return () => {
      messageHandlersRef.current.delete(type);
    };
  }, []);

  /**
   * Gestionnaire du message event
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        // 1. Valider l'origin
        if (!validateOrigin(event, allowedOriginsRef.current)) {
          console.error("[Security] Message rejected: invalid origin");
          return;
        }

        // 2. Valider le message
        const data = event.data;
        if (!validateParentMessage(data)) {
          return;
        }

        const message = data as unknown as IframeMessage<MessageIframeToParent>;

        // 3. Appeler le handler approprié
        const handler = messageHandlersRef.current.get(message.type);
        if (handler) {
          handler(message.payload);
        } else {
          console.warn(`[iframe] No handler for message type: ${message.type}`);
        }

        // 4. Résoudre les messages en attente
        if (message.nonce) {
          const timeoutId = pendingMessagesRef.current.get(message.nonce);
          if (timeoutId) {
            clearTimeout(timeoutId);
            pendingMessagesRef.current.delete(message.nonce);
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("[iframe] Message handling error:", err);
        onError?.(err);
      }
    },
    [onError]
  );

  /**
   * Initialiser le listener
   */
  useEffect(() => {
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage]);

  /**
   * Détecter quand l'iframe est prête
   */
  useEffect(() => {
    const handleReady = () => {
      onReady?.();
    };

    const unsubscribe = on("IFRAME_READY", handleReady);
    return unsubscribe;
  }, [on, onReady]);

  return { send, on };
}

/**
 * Hook enfant (dans l'iframe): reçoit les messages du parent
 * et peut envoyer des réponses
 */
export function useIframeChild(
  onReady?: () => void,
  onError?: ErrorHandler
) {
  const messageHandlersRef = useRef<Map<string, MessageHandler>>(new Map());
  const allowedOriginsRef = useRef<string[]>(getAllowedOrigins());
  const parentWindowRef = useRef<Window | null>(null);

  /**
   * Envoyer un message au parent
   */
  const send = useCallback(
    async <T,>(message: IframeMessage<T>) => {
      if (!parentWindowRef.current) {
        throw new Error("Parent window not available");
      }

      const targetOrigin = allowedOriginsRef.current[0] || "*";
      parentWindowRef.current.postMessage(message, targetOrigin);
    },
    []
  );

  /**
   * S'enregistrer pour recevoir un message
   */
  const on = useCallback((type: string, handler: MessageHandler) => {
    messageHandlersRef.current.set(type, handler);

    return () => {
      messageHandlersRef.current.delete(type);
    };
  }, []);

  /**
   * Gestionnaire du message event
   */
  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        // 1. Valider l'origin
        if (!validateOrigin(event, allowedOriginsRef.current)) {
          console.error("[Security] Message rejected: invalid origin");
          return;
        }

        // Enregistrer le parent
        parentWindowRef.current = event.source as Window;

        // 2. Valider le message
        const data = event.data;
        if (!validateIframeMessage(data)) {
          return;
        }

        const message = data as unknown as IframeMessage<MessageParentToIframe>;

        // 3. Appeler le handler
        const handler = messageHandlersRef.current.get(message.type);
        if (handler) {
          handler(message.payload);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        console.error("[iframe child] Message handling error:", err);
        onError?.(err);
      }
    },
    [onError]
  );

  /**
   * Initialiser
   */
  useEffect(() => {
    window.addEventListener("message", handleMessage);

    // Notifier le parent que l'iframe est prête
    const timer = setTimeout(() => {
      if (parentWindowRef.current) {
        send({
          type: "IFRAME_READY",
          payload: { iframeVersion: "1.0.0" },
          timestamp: Date.now(),
        });
      }
      onReady?.();
    }, 100);

    return () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(timer);
    };
  }, [handleMessage, send, onReady]);

  return { send, on };
}
