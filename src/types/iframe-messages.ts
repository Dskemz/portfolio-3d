/**
 * Types pour la communication postMessage parent <-> iframe
 * Validation stricte de tous les messages échangés
 */

/**
 * Messages du parent vers l'iframe (authentification, configuration)
 */
export type MessageParentToIframe =
  | MessageAuthToken
  | MessageProjectData
  | MessageEditorConfig
  | MessageDisconnect;

/**
 * Messages de l'iframe vers le parent (état, erreurs)
 */
export type MessageIframeToParent =
  | MessageReady
  | MessageSaveProject
  | MessageError
  | MessageStateChange;

/**
 * Format enveloppe pour tous les messages
 */
export interface IframeMessage<T = unknown> {
  type: string;
  payload: T;
  timestamp: number;
  nonce?: string; // Pour détecter les rejeux
}

/**
 * Authentification : envoi du token JWT
 */
export interface MessageAuthToken {
  type: "AUTH_TOKEN";
  payload: {
    token: string;
    projectId: string;
    userId: string;
    expiresIn: number; // secondes
  };
}

/**
 * Données du projet (modèle 3D, cameras, etc.)
 */
export interface MessageProjectData {
  type: "PROJECT_DATA";
  payload: {
    projectId: string;
    modelUrl: string;
    cameras: CameraState[];
    metadata: Record<string, unknown>;
  };
}

/**
 * Configuration de l'éditeur
 */
export interface MessageEditorConfig {
  type: "EDITOR_CONFIG";
  payload: {
    theme: "light" | "dark";
    features: string[];
    uiMode: "simple" | "advanced";
  };
}

/**
 * Déconnexion / revocation du token
 */
export interface MessageDisconnect {
  type: "DISCONNECT";
  payload: {
    reason?: string;
  };
}

/**
 * L'iframe est prête à recevoir des messages
 */
export interface MessageReady {
  type: "IFRAME_READY";
  payload: {
    iframeVersion: string;
  };
}

/**
 * Demande de sauvegarde du projet depuis l'iframe
 */
export interface MessageSaveProject {
  type: "SAVE_PROJECT";
  payload: {
    projectId: string;
    changes: ProjectChanges;
    timestamp: number;
  };
}

/**
 * Erreur dans l'iframe
 */
export interface MessageError {
  type: "ERROR";
  payload: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

/**
 * Changement d'état (édition en cours, sauvegarde, etc.)
 */
export interface MessageStateChange {
  type: "STATE_CHANGE";
  payload: {
    state: "editing" | "saving" | "idle" | "error";
    details?: Record<string, unknown>;
  };
}

/**
 * Types de données métier
 */
export interface CameraState {
  id: string;
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
  name: string;
}

export interface ProjectChanges {
  cameras?: CameraState[];
  lighting?: LightingConfig;
  metadata?: Record<string, unknown>;
}

export interface LightingConfig {
  intensity: number;
  color: string;
  position: [number, number, number];
}

/**
 * Errors spécifiques
 */
export class IframeMessageError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "IframeMessageError";
  }
}
