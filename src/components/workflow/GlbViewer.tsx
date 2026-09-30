"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type {
  AbstractMesh,
  Color3 as BabylonColor3,
  Engine,
  Scene,
  TransformNode as BabylonTransformNode,
} from "@babylonjs/core";

type BabylonCore = typeof import("@babylonjs/core");

/** Orientation Y des chaises du storytelling, raccord avec les images précalculées. */
const STORYTELLING_ROTATION_Y_DEG = 34.77;
/**
 * Caméra calée sur les rendus précalculés (1920×1080) : silhouette du GLB
 * superposée au canal alpha des images (IoU 0,966). Orbite autour du centre
 * de la bounding box ; `offset` reproduit le léger décentrage du rendu.
 */
const STORYTELLING_FRAME = {
  alpha: 1.56887,
  beta: 1.3413,
  radius: 2.52868,
  fov: 0.47489,
  offsetX: -0.0331,
  offsetY: 0.0233,
  aspect: 16 / 9,
};
/** Marge autour de la sphère englobante du modèle (1 = tangente au bord du cadre). */
const FRAME_MARGIN = 1.08;

/** Environnement HDRI préfiltré de l'éclairage studio (étape 04). */
const STUDIO_ENV_URL = "/models/storytelling/studio_small_08_1k.env";
/**
 * Lumières studio d'après la scène Blender (vue de dessus), converties en
 * repère Babylon : (x, y, z) = (-X, Z, -Y) Blender. Hauteurs estimées.
 */
const STUDIO_LIGHTS = [
  // Rectangle bas droit, près de la caméra : key light, porte les ombres.
  { name: "key", position: [-2.9, 2.2, 6.3], intensity: 2.4, color: [1, 0.95, 0.88], shadows: true },
  // Rectangle haut droit, derrière la chaise : contre-jour qui détache la silhouette.
  { name: "rim", position: [-2.2, 2.4, -1.0], intensity: 2.6, color: [1, 0.9, 0.78], shadows: false },
  // Rectangle gauche, éloigné : fill froid rasant.
  { name: "fill", position: [7.6, 1.2, 2.6], intensity: 0.7, color: [0.82, 0.88, 1], shadows: false },
  // Grand carré centré à l'origine : douche de lumière zénithale.
  { name: "top", position: [0, 3.5, 0.5], intensity: 0.4, color: [1, 1, 1], shadows: false },
] as const;

/**
 * Maillage filaire 1 px reconstruit en quads : les diagonales de
 * triangulation (arête la plus longue de ses deux triangles) sont écartées,
 * comme sur le rendu wireframe de l'étape 01.
 */
function createQuadWireframe(core: BabylonCore, mesh: AbstractMesh, color: BabylonColor3) {
  const positions = mesh.getVerticesData(core.VertexBuffer.PositionKind);
  const indices = mesh.getIndices();
  if (!positions || !indices) return null;

  // Soudure des sommets dupliqués (coutures UV / normales) pour retrouver
  // les arêtes partagées entre triangles.
  const welded = new Map<string, number>();
  const ids = new Int32Array(positions.length / 3);
  for (let i = 0; i < ids.length; i++) {
    const key = `${Math.round(positions[i * 3] * 1e5)},${Math.round(positions[i * 3 + 1] * 1e5)},${Math.round(positions[i * 3 + 2] * 1e5)}`;
    if (!welded.has(key)) welded.set(key, i);
    ids[i] = welded.get(key)!;
  }
  const length2 = (a: number, b: number) =>
    (positions[a * 3] - positions[b * 3]) ** 2 +
    (positions[a * 3 + 1] - positions[b * 3 + 1]) ** 2 +
    (positions[a * 3 + 2] - positions[b * 3 + 2]) ** 2;

  const edges = new Map<string, { a: number; b: number; faces: number; longest: number }>();
  for (let t = 0; t < indices.length; t += 3) {
    const v = [ids[indices[t]], ids[indices[t + 1]], ids[indices[t + 2]]];
    const lengths = [length2(v[0], v[1]), length2(v[1], v[2]), length2(v[2], v[0])];
    const longest = lengths.indexOf(Math.max(...lengths));
    for (let e = 0; e < 3; e++) {
      const a = v[e];
      const b = v[(e + 1) % 3];
      const key = a < b ? `${a}_${b}` : `${b}_${a}`;
      const edge = edges.get(key) ?? { a, b, faces: 0, longest: 0 };
      edge.faces++;
      if (e === longest) edge.longest++;
      edges.set(key, edge);
    }
  }

  const point = (i: number) =>
    new core.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
  const lines = [];
  for (const edge of edges.values()) {
    if (edge.faces === 2 && edge.longest === 2) continue;
    lines.push([point(edge.a), point(edge.b)]);
  }

  const wire = core.MeshBuilder.CreateLineSystem(`${mesh.name}-wireframe`, { lines }, mesh.getScene());
  wire.color = color;
  wire.alpha = 0.8;
  wire.isPickable = false;
  wire.parent = mesh;
  // Tiré légèrement vers la caméra pour ne pas scintiller avec la surface.
  if (wire.material) wire.material.zOffset = -2;
  return wire;
}

interface GlbViewerProps {
  /** Chemin d'un .glb à charger. Absent ⇒ mesh placeholder animé. */
  glbUrl?: string;
  /** Monte/démonte le moteur Babylon. À couper hors survol/tap pour ne pas garder un contexte WebGL par fiche. */
  active: boolean;
  /**
   * GLB visible et manipulable. Faux ⇒ préchargé sous l'image précalculée :
   * figé dans sa pose initiale, sans autorotation ni rendu continu, pour une
   * bascule image → 3D instantanée.
   */
  revealed?: boolean;
  onReady?: () => void;
  wireframe?: boolean;
  /** Éclairage studio (HDRI + lumières + ombres) au lieu de la lumière neutre. */
  studioLighting?: boolean;
}

/**
 * Viewer glTF/GLB minimal : caméra orbitale pilotable à la souris/au doigt,
 * autorotation douce, fond transparent. Sans `glbUrl`, affiche un mesh
 * procédural en attendant les vrais fichiers (voir workflowData.ts).
 */
export default function GlbViewer({
  glbUrl,
  active,
  revealed = true,
  onReady,
  wireframe = false,
  studioLighting = false,
}: GlbViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  // Lus depuis la boucle de rendu : des refs évitent de recréer le moteur
  // (et de recharger le GLB) à chaque rendu du parent.
  const onReadyRef = useRef(onReady);
  const revealedRef = useRef(revealed);
  const resetPoseRef = useRef<(() => void) | null>(null);
  const pendingFramesRef = useRef(0);
  const readyRef = useRef(false);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  // Layout effect : la frame est redessinée avant l'affichage, dans le même
  // commit que le retrait de l'image précalculée.
  useLayoutEffect(() => {
    revealedRef.current = revealed;
    // Retour à l'image : le GLB reprend la pose de l'image pour la prochaine
    // bascule, et on redessine une frame puisque le rendu continu s'arrête.
    if (!revealed) resetPoseRef.current?.();
    if (readyRef.current) sceneRef.current?.render();
  }, [revealed]);

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
        TransformNode,
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

      let rotor: BabylonTransformNode | null = null;
      let wireRotor: BabylonTransformNode | null = null;
      // Le pivot glTF vit sous `__root__`, dont le scale Z = -1 inverse le sens
      // de rotation : on compense pour garder la même autorotation visuelle.
      let rotorSpin = 1;

      if (glbUrl) {
        await import("@babylonjs/loaders/glTF");
        const result = await core.SceneLoader.ImportMeshAsync("", "", glbUrl, scene);
        // Hiérarchie glTF : `__root__` (conversion de repère, sans géométrie)
        // → node(s) Blender, dont l'origine est le pivot de l'objet → primitives.
        const gltfRoot = result.meshes[0];
        const renderMeshes = result.meshes.filter(
          (mesh) => mesh.getTotalVertices() > 0 && mesh.isVisible && mesh.isEnabled()
        );

        // Le pivot Blender est conservé tel quel. Un TransformNode n'est créé
        // que si l'export contient plusieurs objets racines à tourner ensemble.
        const topNodes = gltfRoot.getChildren(
          (node): node is BabylonTransformNode => node instanceof TransformNode,
          true
        );
        let pivot: BabylonTransformNode;
        if (topNodes.length === 1) {
          pivot = topNodes[0];
        } else {
          pivot = new TransformNode("model-root", scene);
          pivot.parent = gltfRoot;
          for (const node of topNodes) node.parent = pivot;
        }
        if (pivot.rotationQuaternion) {
          pivot.rotation = pivot.rotationQuaternion.toEulerAngles();
          pivot.rotationQuaternion = null;
        }
        const frame = glbUrl.startsWith("/models/storytelling/") ? STORYTELLING_FRAME : null;
        if (frame) {
          // Valeur imposée (et non ajoutée) : identique à l'orientation native
          // de l'export, sans risque de doublon si l'export change.
          pivot.rotation.set(0, (STORYTELLING_ROTATION_Y_DEG * Math.PI) / 180, 0);
        }

        // Bounding box monde, après rotation, sur les seuls meshes rendus.
        gltfRoot.computeWorldMatrix(true);
        pivot.computeWorldMatrix(true);
        let min = new Vector3(Infinity, Infinity, Infinity);
        let max = new Vector3(-Infinity, -Infinity, -Infinity);
        for (const mesh of renderMeshes) {
          mesh.computeWorldMatrix(true);
          const box = mesh.getBoundingInfo().boundingBox;
          min = Vector3.Minimize(min, box.minimumWorld);
          max = Vector3.Maximize(max, box.maximumWorld);
        }

        if (renderMeshes.length > 0) {
          // `camera.target = …` passe par setTarget(), qui recalculerait
          // alpha / beta / radius depuis l'ancienne position : on les conserve.
          camera.setTarget(min.add(max).scale(0.5), false, false, true);
          const boundingRadius = max.subtract(min).length() / 2;
          camera.minZ = boundingRadius * 0.05;
          camera.maxZ = boundingRadius * 100;
          if (frame) {
            camera.alpha = frame.alpha;
            camera.beta = frame.beta;
            camera.targetScreenOffset = new core.Vector2(frame.offsetX, frame.offsetY);
          }
          const fitCamera = () => {
            const aspect = engine.getAspectRatio(camera);
            let radius: number;
            if (frame) {
              // Même recadrage que l'image précalculée en `object-cover` :
              // au-delà du 16:9, l'image est rognée en haut et en bas.
              const cover = Math.min(1, frame.aspect / aspect);
              camera.fov = 2 * Math.atan(Math.tan(frame.fov / 2) * cover);
              radius = frame.radius;
            } else {
              // Sphère englobante : le modèle reste entier quel que soit l'angle.
              const halfV = camera.fov / 2;
              const halfH = Math.atan(Math.tan(halfV) * aspect);
              radius = (boundingRadius / Math.sin(Math.min(halfV, halfH))) * FRAME_MARGIN;
            }
            // Distance verrouillée : aucun zoom possible, quel que soit l'input.
            camera.lowerRadiusLimit = radius;
            camera.upperRadiusLimit = radius;
            camera.radius = radius;
          };
          fitCamera();
          engine.onResizeObservable.add(fitCamera);
        }

        if (studioLighting && renderMeshes.length > 0) {
          scene.environmentTexture = core.CubeTexture.CreateFromPrefilteredData(STUDIO_ENV_URL, scene);
          scene.environmentIntensity = 0.6;
          light.intensity = 0.15;
          const imageProcessing = scene.imageProcessingConfiguration;
          imageProcessing.toneMappingEnabled = true;
          imageProcessing.toneMappingType = core.ImageProcessingConfiguration.TONEMAPPING_ACES;
          imageProcessing.exposure = 1.15;
          imageProcessing.contrast = 1.2;

          for (const spec of STUDIO_LIGHTS) {
            const position = new Vector3(...spec.position);
            const studioLight = new core.DirectionalLight(
              `studio-${spec.name}`,
              camera.target.subtract(position).normalize(),
              scene
            );
            studioLight.position = position;
            studioLight.intensity = spec.intensity;
            studioLight.diffuse = new Color3(...spec.color);
            if (spec.shadows) {
              const shadows = new core.ShadowGenerator(1024, studioLight);
              shadows.usePercentageCloserFiltering = true;
              shadows.filteringQuality = core.ShadowGenerator.QUALITY_MEDIUM;
              shadows.bias = 0.002;
              shadows.normalBias = 0.01;
              for (const mesh of renderMeshes) {
                shadows.addShadowCaster(mesh);
                mesh.receiveShadows = true;
              }
            }
          }
        }

        // Pose de l'image précalculée, restaurée à chaque retour à l'image.
        const initialRotationY = pivot.rotation.y;
        const initialAlpha = camera.alpha;
        const initialBeta = camera.beta;
        resetPoseRef.current = () => {
          pivot.rotation.y = initialRotationY;
          camera.alpha = initialAlpha;
          camera.beta = initialBeta;
        };

        rotor = pivot;
        rotorSpin = -1;
        if (wireframe) {
          const orange = new Color3(0.95, 0.36, 0.08);
          for (const mesh of renderMeshes) createQuadWireframe(core, mesh, orange);
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
        if (!revealedRef.current) return;
        if (rotor) rotor.rotation.y += rotorSpin * 0.00035 * engine.getDeltaTime();
        if (wireRotor) wireRotor.rotation.y += 0.00035 * engine.getDeltaTime();
      });

      // Shaders compilés et textures (KTX2, HDRI) prêtes avant de signaler le
      // GLB : la bascule image → 3D se fait alors sur une frame complète.
      await scene.whenReadyAsync();
      if (cancelled) return;
      scene.render();
      readyRef.current = true;

      engine.runRenderLoop(() => {
        // Masqué sous l'image : aucun rendu continu, sauf frames demandées.
        if (!revealedRef.current && pendingFramesRef.current <= 0) return;
        if (pendingFramesRef.current > 0) pendingFramesRef.current--;
        scene.render();
      });
      onReadyRef.current?.();
    })();

    const onResize = () => {
      engineRef.current?.resize();
      // Le redimensionnement vide le canvas : une frame, même masqué.
      pendingFramesRef.current = 1;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      resetPoseRef.current = null;
      readyRef.current = false;
      sceneRef.current?.dispose();
      engineRef.current?.dispose();
      sceneRef.current = null;
      engineRef.current = null;
    };
  }, [active, glbUrl, wireframe, studioLighting]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full touch-pan-y"
      aria-label="Modèle 3D interactif"
    />
  );
}
