"use client";

import { useEffect, useRef } from "react";
import type { Engine, Scene, AbstractMesh } from "@babylonjs/core";

interface GlbViewerProps {
  /** Chemin d'un .glb à charger. Absent ⇒ mesh placeholder animé. */
  glbUrl?: string;
  /** Monte/démonte le moteur Babylon. À couper hors survol/tap pour ne pas garder un contexte WebGL par fiche. */
  active: boolean;
  onReady?: () => void;
  wireframe?: boolean;
}

/**
 * Viewer glTF/GLB minimal : caméra orbitale pilotable à la souris/au doigt,
 * autorotation douce, fond transparent. Sans `glbUrl`, affiche un mesh
 * procédural en attendant les vrais fichiers (voir workflowData.ts).
 */
export default function GlbViewer({ glbUrl, active, onReady, wireframe = false }: GlbViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);

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
      // Sur téléphone, le swipe vertical appartient entièrement au récit. Le
      // modèle reste animé après le tap, mais ne reçoit pas le geste de scroll
      // comme une commande de caméra (zoom / déplacement involontaire).
      const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
      if (!isTouchDevice) {
        camera.attachControl(canvasRef.current, true);
        // La molette reste réservée au parcours vertical : le GLB se tourne au
        // clic-glissé, mais son échelle ne peut jamais être modifiée par scroll.
        camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");
      }
      camera.lowerRadiusLimit = 2.6;
      camera.upperRadiusLimit = 7;
      camera.panningSensibility = 0;

      // Sur tactile, seuls les gestes horizontaux pilotent l'orbite. Le geste
      // vertical reste disponible pour le scroll du storytelling.
      let pointerX: number | null = null;
      let pointerY: number | null = null;
      const onPointerDown = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        canvasRef.current?.setPointerCapture(event.pointerId);
      };
      const onPointerMove = (event: PointerEvent) => {
        if (!isTouchDevice || pointerX === null || pointerY === null) return;
        const dx = event.clientX - pointerX;
        const dy = event.clientY - pointerY;
        if (Math.abs(dx) > 0.5) {
          camera.alpha -= dx * 0.012;
        }
        if (Math.abs(dy) > 0.5) camera.beta += dy * 0.012;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (event.cancelable) event.preventDefault();
      };
      const onPointerUp = (event: PointerEvent) => {
        pointerX = null;
        pointerY = null;
        canvasRef.current?.releasePointerCapture(event.pointerId);
      };
      if (isTouchDevice) {
        canvasRef.current?.addEventListener("pointerdown", onPointerDown);
        canvasRef.current?.addEventListener("pointermove", onPointerMove);
        canvasRef.current?.addEventListener("pointerup", onPointerUp);
        canvasRef.current?.addEventListener("pointercancel", onPointerUp);
      }

      const light = new HemisphericLight("light", new Vector3(0.2, 1, 0.3), scene);
      light.intensity = 1.05;

      let rotor: AbstractMesh | null = null;
      let wireRotor: AbstractMesh | null = null;

      if (glbUrl) {
        await import("@babylonjs/loaders/glTF");
        const result = await core.SceneLoader.ImportMeshAsync("", "", glbUrl, scene);
        rotor = result.meshes[0] ?? null;
        if (wireframe) {
          for (const mesh of result.meshes) {
            if (mesh.getTotalVertices() === 0) continue;
            mesh.enableEdgesRendering();
            mesh.edgesWidth = 1.1;
            mesh.edgesColor = new core.Color4(0.95, 0.36, 0.08, 0.95);
          }
        }
      } else {
        const placeholder = MeshBuilder.CreateIcoSphere(
          "placeholder",
          { radius: 1.3, subdivisions: 2, flat: true },
          scene
        );
        const mat = new StandardMaterial("placeholder-mat", scene);
        // Même matière gris clair que le rendu baked de l'étape 01 : le passage
        // image fixe → GLB reste visuellement continu, l'orange étant réservé
        // au courant et au maillage du rendu.
        mat.diffuseColor = new Color3(0.69, 0.7, 0.72);
        mat.specularColor = new Color3(0.28, 0.28, 0.3);
        mat.emissiveColor = new Color3(0.018, 0.018, 0.02);
        placeholder.material = mat;
        rotor = placeholder;

        // Même calque wireframe que la version précédente, légèrement adouci
        // pour conserver toutes les arêtes sans leur donner trop de présence.
        const wire = MeshBuilder.CreateIcoSphere(
          "placeholder-wireframe",
          { radius: 1.304, subdivisions: 2, flat: true },
          scene
        );
        const wireMaterial = new StandardMaterial("placeholder-wireframe-mat", scene);
        wireMaterial.diffuseColor = new Color3(0.95, 0.36, 0.08);
        wireMaterial.emissiveColor = new Color3(0.28, 0.055, 0.006);
        wireMaterial.specularColor = new Color3(0, 0, 0);
        wireMaterial.wireframe = true;
        wireMaterial.alpha = 0.72;
        wireMaterial.backFaceCulling = false;
        wire.material = wireMaterial;
        wireRotor = wire;
      }

      if (cancelled) {
        scene.dispose();
        engine.dispose();
        return;
      }

      scene.registerBeforeRender(() => {
        if (rotor) rotor.rotation.y += 0.00035 * engine.getDeltaTime();
        if (wireRotor) wireRotor.rotation.y += 0.00035 * engine.getDeltaTime();
      });

      engine.runRenderLoop(() => scene.render());
      onReady?.();
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
  }, [active, glbUrl, onReady, wireframe]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full touch-pan-y"
      aria-label="Modèle 3D interactif"
    />
  );
}
