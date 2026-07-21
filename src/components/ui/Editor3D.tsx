"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { useIframeMessenger } from "@/hooks/useIframeMessenger";
import {
  MessageAuthToken,
  MessageProjectData,
  IframeMessageError,
} from "@/types/iframe-messages";
import { createSignedMessage, sanitizeUrl } from "@/lib/security/validation";

interface Editor3DProps {
  /** URL de l'éditeur 3D (doit être sur un domaine autorisé) */
  editorUrl: string;
  /** Token JWT pour l'authentification */
  authToken: string;
  /** ID du projet à éditer */
  projectId: string;
  /** ID utilisateur */
  userId: string;
  /** Durée de vie du token en secondes */
  tokenExpiresIn?: number;
  /** Callback quand l'iframe est prête */
  onReady?: () => void;
  /** Callback pour les erreurs */
  onError?: (error: Error) => void;
  /** Callback quand l'utilisateur sauvegarde */
  onSave?: (changes: unknown) => void;
  /** Classes CSS additionnelles */
  className?: string;
}

/**
 * Composant Editor3D sécurisé
 *
 * Étapes de sécurité mise en place:
 * 1. URL de l'iframe validée et sanitisée
 * 2. Attributs sandbox stricts
 * 3. Communication via postMessage avec validation
 * 4. Authentification par token JWT
 * 5. Validation de tous les messages reçus
 * 6. Gestion des origins autorisés
 */
export default function Editor3D({
  editorUrl,
  authToken,
  projectId,
  userId,
  tokenExpiresIn = 3600,
  onReady,
  onError,
  onSave,
  className = "",
}: Editor3DProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [state, setState] = useState<
    "loading" | "ready" | "error" | "authenticated"
  >("loading");
  const [error, setError] = useState<string | null>(null);

  // Hook de communication sécurisée
  const { send, on } = useIframeMessenger({
  iframeRef: iframeRef as React.RefObject<HTMLIFrameElement>,
    onReady: () => setState("ready"),
    onError: (error) => {
      setError(error.message);
      onError?.(error);
    },
  });

  /**
   * Valider et nettoyer l'URL de l'iframe
   */
  const validateAndSanitizeUrl = useCallback((url: string): string => {
    try {
      return sanitizeUrl(url);
    } catch (err) {
      const errorMsg =
        err instanceof IframeMessageError ? err.message : "Invalid editor URL";
      setError(errorMsg);
      throw err;
    }
  }, []);

  /**
   * Envoyer le token d'authentification à l'iframe
   * ⚠️ IMPORTANT: Fait une fois que l'iframe est prête
   */
  const authenticateIframe = useCallback(async () => {
    try {
      const message = createSignedMessage<MessageAuthToken["payload"]>(
          "AUTH_TOKEN",
          {
            token: authToken,
            projectId,
            userId,
            expiresIn: tokenExpiresIn,
          }
        );

      await send(message);
      setState("authenticated");
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error.message);
      onError?.(error);
    }
  }, [send, authToken, projectId, userId, tokenExpiresIn, onError]);

  /**
   * Envoyer les données du projet à l'iframe
   */
  const loadProjectData = useCallback(
    async (data: {
      modelUrl: string;
      cameras: unknown[];
      metadata?: Record<string, unknown>;
    }) => {
      try {
        const message = createSignedMessage<MessageProjectData["payload"]>(
          "PROJECT_DATA",
          {
            projectId,
            modelUrl: sanitizeUrl(data.modelUrl),
            cameras: data.cameras as MessageProjectData["payload"]["cameras"],
            metadata: data.metadata ?? {},
          }
        );

        await send(message);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error.message);
        onError?.(error);
      }
    },
    [send, projectId, onError]
  );

  /**
   * Écouter les messages de sauvegarde depuis l'iframe
   */
  useEffect(() => {
    const unsubscribe = on("SAVE_PROJECT", (payload: unknown) => {
      console.log("[Editor3D] Save project requested:", payload);
      onSave?.(payload);
    });

    return unsubscribe;
  }, [on, onSave]);

  /**
   * Écouter les erreurs depuis l'iframe
   */
  useEffect(() => {
    const unsubscribe = on("ERROR", (payload: unknown) => {
      const error =
        payload instanceof Error
          ? payload
          : new Error(String(payload));
      console.error("[Editor3D] iframe error:", error);
      setError(error.message);
      setState("error");
      onError?.(error);
    });

    return unsubscribe;
  }, [on, onError]);

  /**
   * Authentifier dès que l'iframe est prête
   */
  useEffect(() => {
    if (state === "ready") {
      authenticateIframe();
    }
  }, [state, authenticateIframe]);

  // Valider l'URL au montage
  useEffect(() => {
    try {
      validateAndSanitizeUrl(editorUrl);
    } catch (err) {
      setState("error");
    }
  }, [editorUrl, validateAndSanitizeUrl]);

  // URL nettoyée
  const sanitizedUrl = validateAndSanitizeUrl(editorUrl);

  return (
    <div className={`relative w-full ${className}`}>
      {/* Conteneur de l'iframe */}
      <div className="relative w-full bg-black rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
        <div
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
          style={{
            opacity: state === "loading" ? 1 : 0,
            transition: "opacity 300ms ease-out",
          }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-700 border-t-[#ff7f50]" />
            <p className="font-mono text-xs uppercase tracking-widest text-zinc-400">
              Chargement de l'éditeur
            </p>
          </div>
        </div>

        {/* iframe sécurisée */}
        <iframe
          ref={iframeRef}
          src={sanitizedUrl}
          title="Éditeur 3D - Visite Virtuelle"
          className="w-full h-full border-none"
          style={{
            aspectRatio: "16 / 9",
            opacity: state !== "loading" ? 1 : 0,
            transition: "opacity 300ms ease-out",
          }}
          // 🔒 SÉCURITÉ: Attributs sandbox stricts
          sandbox={[
            "allow-same-origin", // Nécessaire pour postMessage
            "allow-scripts", // Nécessaire pour Babylon.js
            "allow-presentation", // Pour fullscreen si besoin
            "allow-pointer-lock", // Pour les contrôles 3D
            // ⚠️ PAS DE: allow-top-navigation, allow-popups, allow-forms, etc.
          ].join(" ")}
          // CSP via attribut (complémentaire à celui du header)
          allow="accelerometer; gyroscope; magnetometer"
        />
      </div>

      {/* Zone d'erreur */}
      {state === "error" && error && (
        <div className="mt-4 rounded-lg border border-red-800/50 bg-red-950/20 p-4">
          <p className="font-mono text-sm text-red-400">
            Erreur lors du chargement: {error}
          </p>
        </div>
      )}

      {/* État de la connexion */}
      <div className="mt-3 flex items-center gap-2 font-mono text-xs text-zinc-500">
        <span
          className={`inline-block h-2 w-2 rounded-full ${
            state === "authenticated"
              ? "bg-green-500"
              : state === "error"
                ? "bg-red-500"
                : "bg-yellow-500"
          }`}
        />
        <span className="uppercase tracking-widest">
          {state === "authenticated" && "Connecté"}
          {state === "loading" && "Chargement..."}
          {state === "error" && "Erreur"}
          {state === "ready" && "Authentification en cours..."}
        </span>
      </div>

      {/* Bouton de déconnexion (future feature) */}
      {state === "authenticated" && (
        <button
          onClick={() => {
            send({
              type: "DISCONNECT",
              payload: { reason: "User logout" },
              timestamp: Date.now(),
            });
            setState("loading");
          }}
          className="mt-4 px-4 py-2 font-mono text-xs uppercase tracking-widest rounded border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Déconnecter
        </button>
      )}
    </div>
  );
}
