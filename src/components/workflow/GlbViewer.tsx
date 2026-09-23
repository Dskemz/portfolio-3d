"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Engine, Scene, AbstractMesh } from "@babylonjs/core";

interface GlbViewerProps {
  /** Chemin d'un .glb à charger. Absent ⇒ mesh placeholder animé. */
  glbUrl?: string;
  /** Monte/démonte le moteur Babylon. À couper hors survol/tap pour ne pas garder un contexte WebGL par fiche. */
  active: boolean;
  /** Texte de l'encart qui glisse depuis le bas une fois le rendu prêt. */
  realtimeText?: string;
}

/**
 * Viewer glTF/GLB minimal : caméra orbitale pilotable à la souris/au doigt,
 * autorotation douce, fond transparent. Sans `glbUrl`, affiche un mesh
 * procédural en attendant les vrais fichiers (voir workflowData.ts). Monté
 * uniquement pendant le survol/tap (voir StepVisual), donc `ready` repart
 * toujours de zéro à chaque montage — pas besoin de le réinitialiser.
 */
export default function GlbViewer({ glbUrl, active, realtimeText }: GlbViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;

    (async () => {
      const core = await import("@babylonjs/core");
      const {
        Engine,
        Scene,
        ArcRotateCamera,
        HemisphericLight,
        Vector3,
        Color3,
        Color4,
        MeshBuilder,
        StandardMaterial,
      } = core;

      if (cancelled || !canvasRef.current) return;

      const engine = new Engine(canvasRef.current, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        alpha: true,
      });
      engineRef.current = engine;

      const scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0, 0);
      sceneRef.current = scene;

      const camera = new ArcRotateCamera(
        "cam",
        Math.PI / 2.4,
        Math.PI / 2.5,
        4.2,
        Vector3.Zero(),
        scene
      );
      camera.attachControl(canvasRef.current, true);
      camera.lowerRadiusLimit = 2.6;
      camera.upperRadiusLimit = 7;
      camera.wheelPrecision = 60;
      camera.panningSensibility = 0;

      const light = new HemisphericLight("light", new Vector3(0.2, 1, 0.3), scene);
      light.intensity = 1.05;

      let rotor: AbstractMesh | null = null;

      if (glbUrl) {
        await import("@babylonjs/loaders/glTF");
        const result = await core.SceneLoader.ImportMeshAsync("", "", glbUrl, scene);
        rotor = result.meshes[0] ?? null;
      } else {
        const placeholder = MeshBuilder.CreateIcoSphere(
          "placeholder",
          { radius: 1.3, subdivisions: 2, flat: true },
          scene
        );
        const mat = new StandardMaterial("placeholder-mat", scene);
        mat.diffuseColor = new Color3(0.92, 0.43, 0.26);
        mat.specularColor = new Color3(0.2, 0.2, 0.2);
        mat.emissiveColor = new Color3(0.08, 0.03, 0.01);
        placeholder.material = mat;
        rotor = placeholder;
      }

      if (cancelled) {
        scene.dispose();
        engine.dispose();
        return;
      }

      scene.registerBeforeRender(() => {
        if (rotor) rotor.rotation.y += 0.00035 * engine.getDeltaTime();
      });

      engine.runRenderLoop(() => scene.render());
      setReady(true);
    })();

    const onResize = () => engineRef.current?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      sceneRef.current?.dispose();
      engineRef.current?.dispose();
      sceneRef.current = null;
      engineRef.current = null;
    };
  }, [active, glbUrl]);

  if (!active) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full touch-none"
        aria-label="Modèle 3D interactif"
      />
      {realtimeText && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: ready ? 0 : 40, opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <span className="border border-white/[0.14] bg-black/60 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.28em] text-white/70 backdrop-blur-sm">
            {realtimeText}
          </span>
        </motion.div>
      )}
    </>
  );
}
