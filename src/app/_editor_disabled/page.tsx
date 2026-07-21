/**
 * Page d'édition 3D sécurisée
 * Démontre l'utilisation complète du composant Editor3D
 */

"use client";

import { useState, useEffect } from "react";
import Editor3D from "@/components/ui/Editor3D";
import { validateProjectId } from "@/lib/security/validation";

export default function EditorPage() {
  // Simuler la récupération du token et du projectId depuis l'authentification
  const [authToken, setAuthToken] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  // En production, cela viendrait d'une route API sécurisée
  useEffect(() => {
    // Récupérer les paramètres de la query ou du contexte d'authentification
    const params = new URLSearchParams(window.location.search);
    const projectIdParam = params.get("projectId");

    // Pour la démo uniquement
    setAuthToken(
      process.env.NEXT_PUBLIC_DEMO_TOKEN || "demo-token-12345"
    );
    setProjectId(projectIdParam || "550e8400-e29b-41d4-a716-446655440000");
    setUserId("user-demo-123");
  }, []);

  const handleSave = (changes: unknown) => {
    console.log("Sauvegarde demandée par l'iframe:", changes);

    // Faire un appel API pour sauvegarder
    // await fetch('/api/projects/save', { method: 'POST', body: JSON.stringify(changes) })
  };

  const handleError = (error: Error) => {
    console.error("Erreur depuis l'iframe:", error);
    // Afficher une toast notification
  };

  if (!validateProjectId(projectId)) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-lg border border-red-800 bg-red-950/20 p-6">
          <h1 className="text-lg font-semibold text-red-400">
            Projet invalide
          </h1>
          <p className="mt-2 text-sm text-red-300">
            Le projectId fourni n'est pas valide (doit être un UUIDv4)
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-zinc-950 min-h-screen text-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">
            Éditeur 3D - Visite Virtuelle
          </h1>
          <p className="mt-2 text-zinc-400">
            Configurez votre visite virtuelle immobilière avec l'éditeur 3D
          </p>
        </div>

        {/* Zone d'édition */}
        <Editor3D
          editorUrl={
            process.env.NEXT_PUBLIC_EDITOR_URL ||
            "https://visite3d.example.com/editor"
          }
          authToken={authToken}
          projectId={projectId}
          userId={userId}
          tokenExpiresIn={3600}
          onReady={() => console.log("Éditeur prêt")}
          onError={handleError}
          onSave={handleSave}
          className="mb-8"
        />

        {/* Panel d'informations */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Infos projet */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold">Infos Projet</h2>
            <dl className="mt-4 space-y-2 font-mono text-sm">
              <dt className="text-zinc-500">Projet ID</dt>
              <dd className="text-zinc-300 break-all">{projectId}</dd>

              <dt className="text-zinc-500 mt-3">Utilisateur</dt>
              <dd className="text-zinc-300">{userId}</dd>

              <dt className="text-zinc-500 mt-3">Token</dt>
              <dd className="text-zinc-300">
                {authToken.slice(0, 20)}...
                <span className="text-zinc-600 text-xs ml-2">
                  ({authToken.length} chars)
                </span>
              </dd>
            </dl>
          </div>

          {/* Infos sécurité */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
            <h2 className="text-lg font-semibold">
              Sécurité iframe
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Sandbox strict (allow-scripts)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Validation d'origin</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>Messages validés</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>URL sanitisée</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>CSP configurée</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
