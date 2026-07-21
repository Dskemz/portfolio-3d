/**
 * Validation & Sanitization pour la sécurité iframe
 */

import {
  IframeMessage,
  MessageParentToIframe,
  MessageIframeToParent,
  IframeMessageError,
} from "@/types/iframe-messages";

/**
 * Valide qu'un message provient du bon origin
 * À adapter selon votre domaine
 */
export const ALLOWED_ORIGINS = {
  production: ["https://visite3d.example.com"],
  staging: ["https://staging-visite3d.example.com"],
  development: ["http://localhost:3000"],
};

/**
 * Récupère les origins autorisés selon l'environnement
 */
export function getAllowedOrigins(): string[] {
  const env = process.env.NODE_ENV || "development";
  const origins =
    ALLOWED_ORIGINS[env as keyof typeof ALLOWED_ORIGINS] ||
    ALLOWED_ORIGINS.development;
  return origins;
}

/**
 * Valide l'origin d'un message postMessage
 * ⚠️ ESSENTIEL pour éviter les attaques cross-origin
 */
export function validateOrigin(
  event: MessageEvent,
  expectedOrigins: string[] = getAllowedOrigins()
): boolean {
  const isValid = expectedOrigins.includes(event.origin);

  if (!isValid) {
    console.warn(
      `[Sécurité] Message rejeté: origin "${event.origin}" non autorisé`
    );
  }

  return isValid;
}

/**
 * Valide la structure d'un message parent -> iframe
 */
export function validateParentMessage(
  data: unknown
): data is IframeMessage<MessageParentToIframe> {
  if (!isPlainObject(data)) {
    throw new IframeMessageError(
      "INVALID_MESSAGE_TYPE",
      "Message must be a plain object"
    );
  }

  const msg = data as Record<string, unknown>;

  if (typeof msg.type !== "string") {
    throw new IframeMessageError(
      "INVALID_MESSAGE_TYPE",
      "Message.type must be a string"
    );
  }

  if (!msg.payload || typeof msg.payload !== "object") {
    throw new IframeMessageError(
      "INVALID_PAYLOAD",
      "Message.payload must be an object"
    );
  }

  if (typeof msg.timestamp !== "number" || msg.timestamp <= 0) {
    throw new IframeMessageError(
      "INVALID_TIMESTAMP",
      "Message.timestamp must be a positive number"
    );
  }

  // Vérifier que le timestamp n'est pas trop ancien (> 5 min)
  const now = Date.now();
  const ageMs = now - msg.timestamp;
  const maxAgeMs = 5 * 60 * 1000; // 5 minutes

  if (ageMs > maxAgeMs) {
    throw new IframeMessageError(
      "MESSAGE_EXPIRED",
      `Message timestamp is ${Math.floor(ageMs / 1000)}s old (max: ${Math.floor(maxAgeMs / 1000)}s)`
    );
  }

  return true;
}

/**
 * Valide la structure d'un message iframe -> parent
 */
export function validateIframeMessage(
  data: unknown
): data is IframeMessage<MessageIframeToParent> {
  if (!isPlainObject(data)) {
    throw new IframeMessageError(
      "INVALID_MESSAGE_TYPE",
      "Message must be a plain object"
    );
  }

  const msg = data as Record<string, unknown>;

  if (typeof msg.type !== "string") {
    throw new IframeMessageError(
      "INVALID_MESSAGE_TYPE",
      "Message.type must be a string"
    );
  }

  if (!msg.payload || typeof msg.payload !== "object") {
    throw new IframeMessageError(
      "INVALID_PAYLOAD",
      "Message.payload must be an object"
    );
  }

  return true;
}

/**
 * Valide un JWT token
 * ⚠️ Note: Cette fonction valide UNIQUEMENT la structure JWT
 * Ne pas oublier de valider la signature côté serveur
 */
export function validateJWT(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  try {
    // Décoder le payload (sans valider la signature, c'est au serveur de le faire)
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);

    // Vérifier que le token n'est pas expiré
    if (payload.exp && payload.exp < now) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Sanitize une URL pour éviter les injections
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== "string") {
    throw new IframeMessageError(
      "INVALID_URL_TYPE",
      "URL must be a string"
    );
  }

  try {
    const parsed = new URL(url);

    // Autoriser uniquement https (sauf en dev)
    const isDev = process.env.NODE_ENV === "development";
    const allowedProtocols = isDev ? ["http:", "https:"] : ["https:"];

    if (!allowedProtocols.includes(parsed.protocol)) {
      throw new IframeMessageError(
        "INVALID_PROTOCOL",
        `URL protocol must be one of: ${allowedProtocols.join(", ")}`
      );
    }

    return parsed.toString();
  } catch (err) {
    if (err instanceof IframeMessageError) {
      throw err;
    }
    throw new IframeMessageError(
      "INVALID_URL",
      "URL is malformed"
    );
  }
}

/**
 * Sanitize un string pour éviter XSS
 */
export function sanitizeString(str: unknown, maxLength = 1000): string {
  if (typeof str !== "string") {
    throw new IframeMessageError(
      "INVALID_STRING_TYPE",
      "Value must be a string"
    );
  }

  // Limiter la longueur
  const truncated = str.slice(0, maxLength);

  // Échapper les caractères HTML dangereux
  return truncated
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Valide un projectId (format UUIDv4)
 */
export function validateProjectId(id: unknown): id is string {
  if (typeof id !== "string") {
    return false;
  }

  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(id);
}

/**
 * Utilitaire : vérifier qu'une valeur est un objet plain (pas Array, Date, etc.)
 */
function isPlainObject(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  if (Array.isArray(obj)) {
    return false;
  }

  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype;
}

/**
 * Créer un message signé (pour future extension avec HMAC)
 */
export function createSignedMessage<T>(
  type: string,
  payload: T,
  secret?: string
): IframeMessage<T> {
  const msg: IframeMessage<T> = {
    type,
    payload,
    timestamp: Date.now(),
    nonce: generateNonce(),
  };

  return msg;
}

/**
 * Générer une nonce aléatoire (32 caractères hex)
 */
export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}
