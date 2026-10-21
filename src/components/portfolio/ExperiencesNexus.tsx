"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ActionManager, Color3, Color4, Effect, Engine, ExecuteCodeAction, FreeCamera, FresnelParameters, GlowLayer, MeshBuilder, Scene, ShaderMaterial, StandardMaterial, Vector3, VertexBuffer } from "@babylonjs/core";

const EXPERIENCE_NODES = [
  { id: "studio", label: "Studio", position: new Vector3(-10, 7, 16), satellites: 30 },
  { id: "plaque", label: "Générateur de plaque", position: new Vector3(11, 4, 34), satellites: 30 },
  { id: "bague", label: "Configurateur de bague", position: new Vector3(-9, -6, 52), satellites: 30 },
  { id: "montre", label: "Configurateur de montre", position: new Vector3(10, -4, 72), satellites: 30 },
] as const;

const EXPERIENCE_ROUTES = ["summum-3d", "decotec", "horlogerie-suisse", "withings-scanwatch"] as const;

Effect.ShadersStore["nexusPlanetVertexShader"] = `
  precision highp float;
  attribute vec3 position;
  attribute vec3 normal;
  uniform mat4 world;
  uniform mat4 worldViewProjection;
  uniform float time;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    float n = sin(position.x * 8.0 + time * 0.75) * 0.014 + sin(position.y * 11.0 - position.z * 5.0 + time * 0.52) * 0.01;
    vec3 displaced = position + normal * n;
    vec4 worldPosition = world * vec4(displaced, 1.0);
    vWorldPosition = worldPosition.xyz;
    vWorldNormal = normalize(mat3(world) * normal);
    gl_Position = worldViewProjection * vec4(displaced, 1.0);
  }
`;
Effect.ShadersStore["nexusPlanetFragmentShader"] = `
  precision highp float;
  uniform vec3 cameraPosition;
  uniform float time;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 2.35);
    vec3 interior = vec3(0.008, 0.018, 0.09);
    float angle = atan(vWorldPosition.y, vWorldPosition.x);
    float swirl = .72 + .28 * sin(angle * 8.0 + time * 2.1 + sin(angle * 3.0 + time));
    float contour = smoothstep(0.12, 0.88, fresnel) * swirl;
    vec3 edge = vec3(.34, .2, 1.0);
    vec3 color = mix(interior, edge, contour);
    gl_FragColor = vec4(color, 1.0);
  }
`;
Effect.ShadersStore["nexusPlanetHaloFragmentShader"] = `
  precision highp float;
  uniform vec3 cameraPosition;
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  void main() {
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(normalize(vWorldNormal), viewDirection), 0.0), 2.2);
    float halo = smoothstep(0.18, 0.92, fresnel) * 0.22;
    gl_FragColor = vec4(1.0, 0.22, 0.025, halo);
  }
`;

function createParticleNetwork(scene: Scene, onParentClick: (index: number) => void) {
  const parentMaterial = new StandardMaterial("network-parent-material", scene);
  parentMaterial.diffuseColor = new Color3(.025, .055, .24);
  parentMaterial.emissiveColor = new Color3(.025, .08, .32);
  parentMaterial.alpha = .72;
    parentMaterial.backFaceCulling = true;
  parentMaterial.opacityFresnelParameters = new FresnelParameters();
  parentMaterial.opacityFresnelParameters.leftColor = new Color3(.015, .02, .08);
  parentMaterial.opacityFresnelParameters.rightColor = new Color3(1, .62, .95);
  parentMaterial.opacityFresnelParameters.bias = .12;
  parentMaterial.opacityFresnelParameters.power = 2.6;
  parentMaterial.emissiveFresnelParameters = new FresnelParameters();
  parentMaterial.emissiveFresnelParameters.leftColor = new Color3(.002, .001, .01);
  parentMaterial.emissiveFresnelParameters.rightColor = new Color3(1, .3, .9);
  parentMaterial.emissiveFresnelParameters.bias = .18;
  parentMaterial.emissiveFresnelParameters.power = 2.2;
  const planetMaterial = new ShaderMaterial("network-planet-fresnel", scene, {
    vertex: "nexusPlanet",
    fragment: "nexusPlanet",
  }, {
    attributes: ["position", "normal"],
    uniforms: ["world", "worldViewProjection", "cameraPosition", "time"],
    needAlphaBlending: false,
  });
  planetMaterial.backFaceCulling = true;
  const planetRingMaterial = new StandardMaterial("network-planet-ring-material", scene);
  planetRingMaterial.diffuseColor = new Color3(.28, .2, 1);
  planetRingMaterial.emissiveColor = new Color3(.2, .12, 1);
  planetRingMaterial.alpha = .28;
  const planetHaloMaterial = new StandardMaterial("network-planet-halo-material", scene);
  planetHaloMaterial.diffuseColor = new Color3(.01, .01, .05);
  planetHaloMaterial.emissiveColor = new Color3(.08, .04, .5);
  planetHaloMaterial.opacityFresnelParameters = new FresnelParameters();
  planetHaloMaterial.opacityFresnelParameters.leftColor = new Color3(0, 0, 0);
  planetHaloMaterial.opacityFresnelParameters.rightColor = new Color3(1, 1, 1);
  planetHaloMaterial.opacityFresnelParameters.bias = .08;
  planetHaloMaterial.opacityFresnelParameters.power = 3.2;
  planetHaloMaterial.emissiveFresnelParameters = new FresnelParameters();
  planetHaloMaterial.emissiveFresnelParameters.leftColor = new Color3(0, 0, 0);
  planetHaloMaterial.emissiveFresnelParameters.rightColor = new Color3(.25, .14, 1);
  planetHaloMaterial.emissiveFresnelParameters.bias = .12;
  planetHaloMaterial.emissiveFresnelParameters.power = 2.8;
  planetHaloMaterial.alpha = .18;
  planetHaloMaterial.backFaceCulling = false;
  const satelliteMaterial = new StandardMaterial("network-satellite-material", scene);
  satelliteMaterial.diffuseColor = new Color3(.62, .86, 1);
  satelliteMaterial.emissiveColor = new Color3(.45, .82, 1);
  const parents = EXPERIENCE_NODES.map((node, index) => {
    const dot = MeshBuilder.CreateSphere(`network-parent-${node.id}`, { diameter: 1.35, segments: 24 }, scene);
    const halo = MeshBuilder.CreateSphere(`network-parent-halo-${node.id}`, { diameter: 1.55, segments: 24 }, scene);
    halo.position.copyFrom(node.position);
    halo.material = planetHaloMaterial;
    halo.isVisible = false;
    const positions = dot.getVerticesData(VertexBuffer.PositionKind);
    if (positions) {
      for (let vertexIndex = 0; vertexIndex < positions.length; vertexIndex += 3) {
        const x = positions[vertexIndex];
        const y = positions[vertexIndex + 1];
        const z = positions[vertexIndex + 2];
        const noise = 1 + Math.sin(x * 8 + index * 1.4) * .14 + Math.sin(y * 11 - z * 5 + index) * .09;
        positions[vertexIndex] = x * noise;
        positions[vertexIndex + 1] = y * noise;
        positions[vertexIndex + 2] = z * noise;
      }
      dot.updateVerticesData(VertexBuffer.PositionKind, positions);
    }
    const ringPoints = Array.from({ length: 73 }, (_, pointIndex) => {
      const angle = (pointIndex / 72) * Math.PI * 2;
      const radius = .81 + Math.sin(angle * 3 + index * 1.7) * .055 + Math.sin(angle * 7 - index) * .025;
      return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, Math.sin(angle * 4 + index) * .025);
    });
    const ringColors = ringPoints.map((_, pointIndex) => {
      const pulse = .82 + Math.sin(pointIndex * .7 + index) * .18;
      return new Color4(1, .72, .96, pulse);
    });
    const ring = MeshBuilder.CreateLines(`network-parent-ring-${node.id}`, { points: ringPoints, colors: ringColors, useVertexAlpha: true }, scene);
    dot.position.copyFrom(node.position);
    ring.position.copyFrom(node.position);
    ring.rotation.x = .18 + index * .22;
    ring.rotation.y = .24 - index * .16;
    ring.material = planetRingMaterial;
    ring.isVisible = true;
    dot.metadata = { parentIndex: index };
    dot.isPickable = true;
    dot.actionManager = new ActionManager(scene);
    dot.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => onParentClick(index)));
    dot.material = planetMaterial;
    return { ...node, dot, ring, halo, index };
  });
  const childPoints: Array<{ parentId: string; seed: number; base: Vector3 }> = parents.flatMap((parent) => Array.from({ length: parent.satellites }, (_, index) => ({
    parentId: parent.id,
    seed: parent.index * 17 + index * 1.731,
    base: parent.position.add(new Vector3((index - 1.5) * 5.5, ((index * 7) % 3 - 1) * 3.5, (index - 1.5) * 4)),
  })));
  const points: Array<{ parentId: string; seed: number; base: Vector3 }> = childPoints.map((point) => point).concat([
    [-30, 16, 18], [-22, 15, 28], [-12, 17, 38], [2, 16, 50], [15, 16, 62], [28, 15, 72],
    [-32, 7, 24], [-28, 1, 34], [-30, -8, 46], [-24, -16, 58], [-10, -17, 70], [5, -16, 78], [20, -17, 68], [32, -8, 54], [30, 3, 40], [33, 12, 26],
    [-18, 10, 72], [0, 11, 82], [18, 10, 76], [-17, -11, 82], [2, -12, 88], [18, -10, 80],
    ...Array.from({ length: 120 }, (_, index) => {
      const column = index % 12;
      const row = Math.floor(index / 12);
      return [
        -32 + column * 5.8 + Math.sin(index * 2.4) * 2.5,
        -18 + row * 7.2 + Math.cos(index * 1.7) * 2.2,
        16 + ((index * 13) % 72),
      ] as [number, number, number];
    }),
    ...Array.from({ length: 80 }, (_, index) => {
      const column = index % 8;
      const row = Math.floor(index / 8);
      return [
        -26 + column * 7.2 + Math.sin(index * 1.9) * 1.8,
        -15 + row * 5.2 + Math.cos(index * 2.1) * 1.5,
        22 + ((index * 9) % 58),
      ] as [number, number, number];
    }),
    ...Array.from({ length: 160 }, (_, index) => {
      const column = index % 12;
      const row = Math.floor(index / 12);
      const layer = row % 2;
      return [
        -33 + column * 6 + Math.sin(index * 1.3) * 1.2,
        (layer === 0 ? 13 : -13) + (Math.floor(row / 2) - 2) * 4.2 + Math.cos(index * 1.1) * 1.1,
        18 + ((index * 5) % 62) + layer * 2,
      ] as [number, number, number];
    }),
    ...Array.from({ length: 120 }, (_, index) => {
      const column = index % 16;
      const row = Math.floor(index / 16);
      return [
        -36 + column * 4.8 + Math.sin(index * 1.17) * 1.4,
        -18 + (row % 10) * 4 + Math.cos(index * 1.43) * 1.5,
        14 + Math.floor(row / 10) * 8 + (index % 7) * 2.8,
      ] as [number, number, number];
    }),
  ].map(([x, y, z], index) => ({
    parentId: "ambient",
    seed: 100 + index * 2.13,
    base: new Vector3(x, y, z),
  })));
  const dots = points.map((_, index) => {
    const dot = MeshBuilder.CreateSphere(`network-satellite-${index}`, { diameter: index < childPoints.length ? .38 : .24 }, scene);
    dot.material = satelliteMaterial;
    return dot;
  });
  const ambientPairs: Array<[number, number]> = [];
  const seenPairs = new Set<string>();
  points.forEach((point, index) => {
    const nearest = points
      .map((candidate, candidateIndex) => ({ candidate, candidateIndex, distance: Vector3.Distance(point.base, candidate.base) }))
      .filter(({ candidateIndex }) => candidateIndex !== index)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);
    nearest.forEach(({ candidateIndex }) => {
      const first = Math.min(index, candidateIndex);
      const second = Math.max(index, candidateIndex);
      const key = `${first}:${second}`;
      if (!seenPairs.has(key)) {
        seenPairs.add(key);
        ambientPairs.push([first, second]);
      }
    });
  });
  const ambientConnectionPositions = ambientPairs.map(() => [Vector3.Zero(), Vector3.Zero()]);
  const ambientConnectionColors = ambientPairs.map(() => [new Color4(.22, .62, .9, 0), new Color4(.22, .62, .9, 0)]);
  const ambientConnections = MeshBuilder.CreateLineSystem("network-ambient-connections", {
    lines: ambientConnectionPositions,
    colors: ambientConnectionColors,
    useVertexAlpha: true,
  }, scene);
  ambientConnections.isPickable = false;
  const explosionMaterial = new StandardMaterial("network-explosion-material", scene);
  explosionMaterial.diffuseColor = new Color3(.7, .9, 1);
  explosionMaterial.emissiveColor = new Color3(.55, .85, 1);
  const explosionParticles = Array.from({ length: 48 }, (_, index) => {
    const particle = MeshBuilder.CreateSphere(`network-explosion-${index}`, { diameter: .12 + (index % 4) * .035, segments: 8 }, scene);
    particle.material = explosionMaterial;
    particle.isVisible = false;
    return particle;
  });
  const explosionConnectionCount = 96;
  const explosionConnectionPositions = Array.from({ length: explosionConnectionCount }, () => [Vector3.Zero(), Vector3.Zero()]);
  const explosionConnectionColors = Array.from({ length: explosionConnectionCount }, () => [new Color4(.3, .78, 1, 0), new Color4(.3, .78, 1, 0)]);
  const explosionConnections = MeshBuilder.CreateLineSystem("network-explosion-connections", {
    lines: explosionConnectionPositions,
    colors: explosionConnectionColors,
    useVertexAlpha: true,
  }, scene);
  explosionConnections.isVisible = false;
  explosionConnections.isPickable = false;
  let explosion: { started: number; origin: Vector3; velocities: Vector3[] } | null = null;
  const explode = (index: number, time: number) => {
    const parent = parents[index];
    if (!parent) return;
    const origin = parent.dot.position.clone();
    explosion = {
      started: time,
      origin,
      velocities: explosionParticles.map((_, particleIndex) => {
        const angle = particleIndex * 2.39996;
        const radius = .65 + (particleIndex % 7) * .16;
        return new Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.37) * radius * .82,
          Math.sin(angle) * radius,
        );
      }),
    };
    parent.dot.isVisible = false;
    parent.halo.isVisible = false;
    parent.ring.isVisible = false;
    explosionParticles.forEach((particle, particleIndex) => {
      particle.position.copyFrom(origin);
      particle.isVisible = true;
      particle.visibility = 1;
      particle.scaling.setAll(.7 + (particleIndex % 3) * .18);
      particle.isPickable = true;
      particle.actionManager = new ActionManager(scene);
      particle.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnPickTrigger, () => onParentClick(index)));
    });
    explosionConnections.isVisible = true;
  };
  const parentOffsets = parents.map(() => new Vector3());
  let reformation: { started: number; index: number; fromPositions: Vector3[] } | null = null;
  const startReformation = (index: number, time: number) => {
    reformation = { started: time, index, fromPositions: [] };
    parents[index].dot.isVisible = true;
    parents[index].halo.isVisible = false;
    parents[index].ring.isVisible = true;
    parents[index].dot.scaling.setAll(.05);
    parentOffsets[index].set(0, 0, 0);
  };
  const reform = (index: number) => {
    const parent = parents[index];
    if (!parent) return;
    const fromPositions = explosionParticles.filter((particle) => particle.isVisible).map((particle) => particle.position.clone());
    reformation = { started: performance.now(), index, fromPositions };
    parent.dot.isVisible = true;
    parent.halo.isVisible = false;
    parent.ring.isVisible = true;
    parent.dot.scaling.setAll(.05);
  };
  const update = (time: number, cameraPosition?: Vector3) => {
    planetMaterial.setFloat("time", time * .001);
    if (cameraPosition) planetMaterial.setVector3("cameraPosition", cameraPosition);
    parents.forEach((parent, index) => {
      const offset = parentOffsets[index];
      offset.x = Math.sin(time * .00007 + index * 1.8) * .35;
      offset.y = Math.cos(time * .000058 + index * 1.4) * .25;
      offset.z = Math.sin(time * .000045 + index * 2.1) * .45;
      parent.dot.position.copyFrom(parent.position);
      parent.dot.position.addInPlace(offset);
      parent.ring.position.copyFrom(parent.dot.position);
      parent.halo.position.copyFrom(parent.dot.position);
      parent.ring.rotation.z += .0007;
    });
    const childPositions = points.map((point, index) => {
      const position = point.base.clone();
      const parentIndex = parents.findIndex((parent) => parent.id === point.parentId);
      if (parentIndex >= 0) position.addInPlace(parentOffsets[parentIndex]);
      position.x += Math.sin(time * .0001 + point.seed) * 4.2 + Math.sin(time * .00005 + index) * 2.2;
      position.y += Math.cos(time * .000085 + point.seed * 1.7) * 3.2;
      position.z += Math.sin(time * .00007 + point.seed * .8) * 5.5;
      dots[index].position.copyFrom(position);
      if (cameraPosition) {
        const cameraDistance = Vector3.Distance(cameraPosition, position);
        dots[index].isVisible = cameraDistance <= 105;
      }
      return position;
    });
    const ambientPositionData: number[] = [];
    const ambientColorData: number[] = [];
    ambientPairs.forEach(([first, second], pairIndex) => {
      const firstPosition = childPositions[first];
      const secondPosition = childPositions[second];
      const distance = Vector3.Distance(firstPosition, secondPosition);
      const alpha = distance <= 7 ? Math.max(0, Math.min(.42, (7 - distance) / 7 * .42)) : 0;
      ambientPositionData.push(firstPosition.x, firstPosition.y, firstPosition.z, secondPosition.x, secondPosition.y, secondPosition.z);
      ambientColorData.push(.22, .62, .9, alpha, .22, .62, .9, alpha);
      ambientConnectionPositions[pairIndex][0].copyFrom(firstPosition);
      ambientConnectionPositions[pairIndex][1].copyFrom(secondPosition);
    });
    ambientConnections.updateVerticesData(VertexBuffer.PositionKind, new Float32Array(ambientPositionData));
    ambientConnections.updateVerticesData(VertexBuffer.ColorKind, new Float32Array(ambientColorData));
    if (explosion) {
      const elapsed = Math.min((time - explosion.started) / 1500, 1);
      const ease = 1 - Math.pow(1 - elapsed, 3);
      explosionParticles.forEach((particle, index) => {
        particle.position.copyFrom(explosion!.origin).addInPlace(explosion!.velocities[index].scale(ease));
        particle.position.x += Math.sin(time * .0007 + index) * .08;
        particle.position.y += Math.cos(time * .0006 + index * .7) * .08;
        particle.position.z += Math.sin(time * .0005 + index * .4) * .08;
        particle.visibility = .9;
      });
      const connectionData = explosionConnectionPositions.flatMap((line) => line.flatMap((point) => [point.x, point.y, point.z]));
      const colorData = explosionConnectionColors.flatMap((line) => line.flatMap((color) => [color.r, color.g, color.b, color.a]));
      const nearbyPairs: Array<[number, number, number]> = [];
      for (let first = 0; first < explosionParticles.length; first += 1) {
        for (let second = first + 1; second < explosionParticles.length; second += 1) {
          const distance = Vector3.Distance(explosionParticles[first].position, explosionParticles[second].position);
          if (distance < 2.8) nearbyPairs.push([distance, first, second]);
        }
      }
      nearbyPairs.sort((a, b) => a[0] - b[0]);
      for (let lineIndex = 0; lineIndex < explosionConnectionCount; lineIndex += 1) {
        const pair = nearbyPairs[lineIndex];
        const first = pair ? explosionParticles[pair[1]].position : explosionParticles[0].position;
        const second = pair ? explosionParticles[pair[2]].position : first;
        const offset = lineIndex * 6;
        connectionData[offset] = first.x;
        connectionData[offset + 1] = first.y;
        connectionData[offset + 2] = first.z;
        connectionData[offset + 3] = second.x;
        connectionData[offset + 4] = second.y;
        connectionData[offset + 5] = second.z;
        const colorOffset = lineIndex * 8;
        const alpha = pair ? Math.max(0, Math.min(.72, 1 - pair[0] / 2.8)) : 0;
        colorData[colorOffset + 3] = alpha;
        colorData[colorOffset + 7] = alpha;
      }
      explosionConnections.updateVerticesData(VertexBuffer.PositionKind, new Float32Array(connectionData));
      explosionConnections.updateVerticesData(VertexBuffer.ColorKind, new Float32Array(colorData));
    }
    if (cameraPosition) {
      parents.forEach((parent) => {
        const distance = Vector3.Distance(cameraPosition, parent.dot.position);
        parent.dot.scaling.setAll(Math.max(.72, Math.min(1.35, .45 + distance * .012)));
        parent.ring.scaling.copyFrom(parent.dot.scaling);
        parent.halo.scaling.copyFrom(parent.dot.scaling).scaleInPlace(1.08);
      });
      dots.forEach((dot, index) => {
        const distance = Vector3.Distance(cameraPosition, dot.position);
        const baseScale = index < childPoints.length ? .38 : .24;
        const depthBlur = Math.max(0, Math.min(1, (distance - 52) / 38));
        const depthScale = Math.max(.84, Math.min(1.48, .84 + distance * .004 + depthBlur * .18));
        dot.scaling.setAll(baseScale * depthScale);
        dot.visibility = Math.max(.58, Math.min(1, 1.04 - distance * .002 - depthBlur * .18));
      });
    }
    if (reformation) {
      const progress = Math.min((time - reformation.started) / 1100, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      parents[reformation.index].dot.scaling.setAll(.05 + eased * .95);
      if (reformation.fromPositions.length) {
        explosionParticles.forEach((particle, index) => {
          const from = reformation!.fromPositions[index] ?? reformation!.fromPositions[0];
          if (!from) return;
          particle.position.copyFrom(Vector3.Lerp(from, parents[reformation!.index].dot.position, eased));
          particle.visibility = Math.max(0, 1 - eased);
        });
      }
      if (progress >= 1) {
        explosion = null;
        explosionConnections.isVisible = false;
        explosionParticles.forEach((particle) => {
          particle.isVisible = false;
          particle.actionManager = null;
        });
        reformation = null;
      }
    }
  };
  return { update, parents, explode, startReformation, reform };
}

function bezierProgress(value: number) {
  const sign = Math.sign(value);
  const t = Math.min(Math.abs(value), 1);
  const inverse = 1 - t;
  return sign * (3 * inverse * t * t + t * t * t);
}

export default function ExperiencesNexus() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnteringExperience, setIsEnteringExperience] = useState(false);
  const [isTransitionLoaderVisible, setIsTransitionLoaderVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
    const scene = new Scene(engine);
    const glow = new GlowLayer("network-glow", scene);
    glow.intensity = 1.1;
  scene.clearColor = new Color3(.035, .047, .067).toColor4(1);
    const baseCameraPosition = new Vector3(0, 4.8, -10);
    const baseCameraTarget = new Vector3(0, 2, 28);
    const camera = new FreeCamera("nexus-camera", baseCameraPosition.clone(), scene);
    camera.setTarget(baseCameraTarget.clone());
    camera.minZ = .05;
    scene.activeCamera = camera;

    let targetYaw = 0;
    let targetPitch = 0;
    let yaw = 0;
    let pitch = 0;
    const handlePointerMove = (event: PointerEvent) => {
      const horizontal = event.clientX / window.innerWidth * 2 - 1;
      const vertical = event.clientY / window.innerHeight * 2 - 1;
      targetYaw = Math.max(-0.38, Math.min(0.38, -bezierProgress(horizontal) * 0.38));
      targetPitch = Math.max(-0.32, Math.min(0.32, bezierProgress(vertical) * 0.32));
    };
    let focusedPlanet: Vector3 | null = null;
    let explodedPlanetIndex: number | null = null;
    let travel: { started: number; from: Vector3; destination: Vector3; fromTarget: Vector3; target: Vector3 } | null = null;
    const returnToOrigin = () => {
      travel = {
        started: performance.now(),
        from: camera.position.clone(),
        destination: baseCameraPosition.clone(),
        fromTarget: camera.getTarget().clone(),
        target: baseCameraTarget.clone(),
      };
      focusedPlanet = null;
      explodedPlanetIndex = null;
      targetYaw = 0;
      targetPitch = 0;
    };
    const selectPlanet = (index: number) => {
      try {
        if (explodedPlanetIndex !== null && explodedPlanetIndex !== index) {
          network.reform(explodedPlanetIndex);
          explodedPlanetIndex = null;
        }
        const destination = EXPERIENCE_NODES[index].position.clone();
        if (focusedPlanet && Vector3.Distance(focusedPlanet, destination) < .01) {
          const diveTarget = destination.clone().add(new Vector3(0, -24, 0));
          travel = {
            started: performance.now(),
            from: camera.position.clone(),
            destination: camera.position.clone().add(new Vector3(0, -24, 0)),
            fromTarget: camera.getTarget().clone(),
            target: diveTarget,
          };
          setIsEnteringExperience(true);
          setIsTransitionLoaderVisible(false);
          window.setTimeout(() => setIsTransitionLoaderVisible(true), 1050);
          window.setTimeout(() => router.push(`/portfolio/${EXPERIENCE_ROUTES[index]}`), 2200);
          return;
        }
        const cameraPosition = destination.clone().add(new Vector3(0, 0, -8));
        travel = {
          started: performance.now(),
          from: camera.position.clone(),
          destination: cameraPosition,
          fromTarget: camera.getTarget().clone(),
          target: destination,
        };
        focusedPlanet = null;
        explodedPlanetIndex = null;
        targetYaw = 0;
        targetPitch = 0;
      } catch { /* Ignore invalid parent indices. */ }
    };
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0) {
        event.preventDefault();
        setIsEnteringExperience(false);
        setIsTransitionLoaderVisible(false);
        if (explodedPlanetIndex !== null) network.reform(explodedPlanetIndex);
        returnToOrigin();
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: false });
    const network = createParticleNetwork(scene, selectPlanet);
    const planetGlow = new GlowLayer("network-planet-glow", scene);
    planetGlow.intensity = .58;
    planetGlow.blurKernelSize = 64;
    network.parents.forEach(({ dot, ring }) => {
      planetGlow.addIncludedOnlyMesh(dot);
      planetGlow.addIncludedOnlyMesh(ring);
    });
    const returnSlug = new URLSearchParams(window.location.search).get("return");
    if (returnSlug) {
      const returnIndex = EXPERIENCE_ROUTES.indexOf(returnSlug as (typeof EXPERIENCE_ROUTES)[number]);
      if (returnIndex >= 0) network.startReformation(returnIndex, performance.now());
    }
    const loadingFallback = window.setTimeout(() => setIsLoading(false), 1800);

    scene.onAfterRenderObservable.addOnce(() => {
      window.setTimeout(() => setIsLoading(false), 650);
    });

    scene.onBeforeRenderObservable.add(() => {
      yaw += (targetYaw - yaw) * .014;
      pitch += (targetPitch - pitch) * .014;
      const normalTarget = new Vector3(
        Math.sin(yaw) * 18,
        2 + pitch * 9,
        28 + Math.cos(yaw) * 18,
      );
      const now = performance.now();
      if (travel) {
        const progress = Math.min((now - travel.started) / 1800, 1);
        const eased = progress < .5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        camera.position.copyFrom(Vector3.Lerp(travel.from, travel.destination, eased));
        camera.setTarget(Vector3.Lerp(travel.fromTarget, travel.target, eased));
        if (progress >= .72 && explodedPlanetIndex === null) {
          const selectedIndex = EXPERIENCE_NODES.findIndex((node) => Vector3.Distance(node.position, travel!.target) < .01);
          if (selectedIndex >= 0) {
            explodedPlanetIndex = selectedIndex;
            focusedPlanet = travel.target.clone();
            network.explode(selectedIndex, now);
          }
        }
        if (progress >= 1) {
          focusedPlanet = travel.target.clone();
          travel = null;
        }
      } else {
        camera.setTarget(focusedPlanet ?? normalTarget);
      }
      network.update(now, camera.position);
    });
    engine.runRenderLoop(() => scene.render());
    const resize = () => engine.resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("wheel", handleWheel);
      window.clearTimeout(loadingFallback);
      scene.dispose();
      engine.dispose();
    };
  }, []);


  return (
    <section aria-label="Exploration 3D du maillage Nexus" className="nexus-scene relative h-screen min-h-[680px] w-full overflow-hidden bg-[#090c11]">
      <canvas ref={canvasRef} className={`absolute inset-0 z-10 h-full w-full cursor-pointer touch-none antialiased ${isEnteringExperience ? "nexus-canvas-fade" : ""}`} />
      <div className={`nexus-experience-transition ${isEnteringExperience ? "is-active" : ""}`} aria-hidden="true">
        <div className={`nexus-experience-transition-loader ${isTransitionLoaderVisible ? "is-visible" : ""}`}>
          <div className="n3d-loader" aria-label="Chargement de l’expérience Nexus">
            <span className="n3d-loader-point n3d-loader-point-top" />
            <span className="n3d-loader-point n3d-loader-point-left" />
            <span className="n3d-loader-point n3d-loader-point-right" />
          </div>
        </div>
      </div>
      <div className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#090c11] transition-opacity duration-700 ${isLoading ? "opacity-100" : "opacity-0"}`} aria-hidden={!isLoading}>
        <div className="flex flex-col items-center gap-5">
          <div className="n3d-loader" aria-label="Chargement de l’expérience 3D">
            <span className="n3d-loader-point n3d-loader-point-top" />
            <span className="n3d-loader-point n3d-loader-point-left" />
            <span className="n3d-loader-point n3d-loader-point-right" />
          </div>
        </div>
      </div>
    </section>
  );
}


