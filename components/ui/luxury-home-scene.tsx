"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { cn } from "@/lib/utils";

const STAGES = [
  { label: "Site & grading", caption: "Survey, excavation, and access" },
  { label: "Foundation", caption: "Slab, footings, and terrace deck" },
  { label: "Structure", caption: "Steel framing and floor plates" },
  { label: "Enclosure", caption: "Volumes, roofs, and cladding" },
  { label: "Signature finish", caption: "Glazing, lighting, and landscape" },
] as const;

const STAGE_MS = 2000;

/** Starting guess for the camera fit; the fit loop below refines both of these per container. */
const FIT_RADIUS = 6.6;
const FIT_CENTER_Y = 3.15;

type Part = {
  mesh: THREE.Mesh;
  stage: number;
  /** Last layer this part belongs to — temporary site work retires once building starts. */
  until: number;
  delay: number;
  rise: number;
  baseY: number;
  baseOpacity: number;
  baseEmissive: number;
  reveal: number;
  from: number;
};

export function LuxuryHomeScene({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef(0);
  const levelChangedAtRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const [level, setLevel] = useState(0);
  // Reduced motion holds the completed home instead of cycling through the build.
  const activeLevel = reduceMotion ? STAGES.length - 1 : level;

  // Advance one construction layer every two seconds; a manual pick restarts the timer.
  useEffect(() => {
    levelRef.current = activeLevel;
    levelChangedAtRef.current = performance.now();
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setLevel((current) => (current + 1) % STAGES.length), STAGE_MS);
    return () => window.clearTimeout(timer);
  }, [activeLevel, reduceMotion]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, 1, 0.5, 200);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = 0.55;
    pmrem.dispose();

    scene.add(new THREE.HemisphereLight(0xcfe3ff, 0x061020, 0.85));
    const keyLight = new THREE.DirectionalLight(0xffe6b8, 2.7);
    keyLight.position.set(11, 16, 9);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.bias = -0.0006;
    keyLight.shadow.normalBias = 0.02;
    const shadowCamera = keyLight.shadow.camera;
    shadowCamera.left = -12;
    shadowCamera.right = 12;
    shadowCamera.top = 12;
    shadowCamera.bottom = -12;
    shadowCamera.near = 1;
    shadowCamera.far = 45;
    shadowCamera.updateProjectionMatrix();
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x6fb3e8, 1.5);
    rimLight.position.set(-10, 7, -12);
    scene.add(rimLight);
    const goldGlow = new THREE.PointLight(0xd6aa55, 26, 26, 2);
    goldGlow.position.set(-5, 3.4, 6);
    scene.add(goldGlow);

    const model = new THREE.Group();
    scene.add(model);

    const materials = {
      steel: new THREE.MeshStandardMaterial({ color: 0xd6aa55, roughness: 0.31, metalness: 0.88 }),
      darkSteel: new THREE.MeshStandardMaterial({ color: 0x263341, roughness: 0.6, metalness: 0.25 }),
      concrete: new THREE.MeshStandardMaterial({ color: 0x4a5259, roughness: 0.94, metalness: 0.02 }),
      deckConcrete: new THREE.MeshStandardMaterial({ color: 0x454d55, roughness: 0.97, metalness: 0.02 }),
      stucco: new THREE.MeshStandardMaterial({ color: 0xe4ddcf, roughness: 0.82, metalness: 0.02 }),
      charcoal: new THREE.MeshStandardMaterial({ color: 0x232e39, roughness: 0.66, metalness: 0.14 }),
      wood: new THREE.MeshStandardMaterial({ color: 0x9c6a3c, roughness: 0.66, metalness: 0.05 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0x0c2537,
        roughness: 0.06,
        metalness: 0.1,
        ior: 1.45,
        reflectivity: 0.45,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      }),
      // Glazing with the interior lit behind it — one surface, so nothing can sort in front of it.
      litGlass: new THREE.MeshPhysicalMaterial({
        color: 0x0e1e2c,
        emissive: 0xc47c2c,
        emissiveIntensity: 1.05,
        roughness: 0.08,
        metalness: 0.05,
        reflectivity: 0.4,
        clearcoat: 0.4,
      }),
      water: new THREE.MeshStandardMaterial({ color: 0x2b7f9c, roughness: 0.08, metalness: 0.25, emissive: 0x0d3d52, emissiveIntensity: 0.5 }),
      warm: new THREE.MeshStandardMaterial({ color: 0xc98b36, emissive: 0xc4741f, emissiveIntensity: 1.05, roughness: 0.35, metalness: 0 }),
      earth: new THREE.MeshStandardMaterial({ color: 0x2b3138, roughness: 1, metalness: 0 }),
      layout: new THREE.MeshStandardMaterial({ color: 0xd6aa55, emissive: 0xb4832f, emissiveIntensity: 1.4, roughness: 0.5, metalness: 0.2 }),
      foliage: new THREE.MeshStandardMaterial({ color: 0x27503d, roughness: 0.95, metalness: 0 }),
      trunk: new THREE.MeshStandardMaterial({ color: 0x53412f, roughness: 0.88, metalness: 0 }),
    };

    const parts: Part[] = [];
    let order = 0;

    const register = (
      mesh: THREE.Mesh,
      stage: number,
      { rise = 1.4, opacity = 1, until = STAGES.length - 1 }: { rise?: number; opacity?: number; until?: number } = {},
    ) => {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      const material = mesh.material as THREE.Material & { opacity: number; emissiveIntensity?: number };
      material.transparent = true;
      material.depthWrite = true;
      parts.push({
        mesh,
        stage,
        until,
        delay: Math.min(0.85, (order++ % 22) * 0.035),
        rise,
        baseY: mesh.position.y,
        baseOpacity: opacity,
        baseEmissive: material.emissiveIntensity ?? 0,
        reveal: 0,
        from: 0,
      });
      model.add(mesh);
      return mesh;
    };

    const slab = (
      stage: number,
      size: [number, number, number],
      position: [number, number, number],
      material: THREE.Material,
      options: { rise?: number; opacity?: number; rotationY?: number; until?: number } = {},
    ) => {
      const radius = Math.min(0.05, Math.min(...size) * 0.3);
      const geometry = new RoundedBoxGeometry(size[0], size[1], size[2], 2, radius);
      const mesh = new THREE.Mesh(geometry, material.clone());
      mesh.position.set(...position);
      if (options.rotationY) mesh.rotation.y = options.rotationY;
      return register(mesh, stage, options);
    };

    /* ---------------------------------------------------------------- stage 0 — site */
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(13, 72),
      new THREE.MeshStandardMaterial({ color: 0x0a1c2c, roughness: 0.97, metalness: 0, transparent: true }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.14;
    ground.receiveShadow = true;
    register(ground, 0, { rise: 0 });

    const grid = new THREE.GridHelper(26, 26, 0x9c7a34, 0x1d3449);
    grid.position.y = -0.1;
    (grid.material as THREE.Material & { opacity: number }).transparent = true;
    (grid.material as THREE.Material & { opacity: number }).opacity = 0.22;
    model.add(grid);

    slab(0, [10.4, 0.24, 7.8], [0, -0.04, 0], materials.earth, { rise: 0 });
    slab(0, [3.4, 0.08, 5.6], [-2.9, 0.02, 6.3], materials.concrete, { rise: 0.4 });
    // Layout lines and survey stakes mark out the footprint, then come down once framing starts.
    [-3.35, 3.35].forEach((z) => slab(0, [9.4, 0.05, 0.07], [0, 0.11, z], materials.layout, { rise: 0.3, until: 1 }));
    [-4.7, 4.7].forEach((x) => slab(0, [0.07, 0.05, 6.7], [x, 0.11, 0], materials.layout, { rise: 0.3, until: 1 }));
    const stakes: Array<[number, number]> = [
      [-4.9, 3.6],
      [4.9, 3.6],
      [-4.9, -3.6],
      [4.9, -3.6],
      [0, 3.9],
      [0, -3.9],
    ];
    stakes.forEach(([x, z]) => slab(0, [0.08, 1.1, 0.08], [x, 0.55, z], materials.steel, { rise: 0.8, until: 1 }));
    [-3.75, 3.75].forEach((z) =>
      slab(0, [9.9, 0.04, 0.04], [0, 1.02, z], materials.layout, { rise: 0.6, opacity: 0.85, until: 1 }),
    );

    /* ---------------------------------------------------- stage 1 — foundation */
    slab(1, [9.2, 0.4, 6.6], [0, 0.2, 0], materials.concrete);
    [-4.5, 4.5].forEach((x) => slab(1, [0.4, 0.9, 6.6], [x, 0.05, 0], materials.deckConcrete));
    [-3.2, 3.2].forEach((z) => slab(1, [9.2, 0.9, 0.4], [0, 0.05, z], materials.deckConcrete));
    slab(1, [3.6, 0.3, 2.4], [3.4, 0.15, 4.5], materials.concrete);
    [0.34, 0.2].forEach((y, index) => slab(1, [2.6, 0.16, 0.5 - index * 0.16], [0.3, y, 3.6 + index * 0.42], materials.concrete));

    /* ------------------------------------------------------- stage 2 — framing */
    const columnZ = [-2.95, -1, 1, 2.95];
    [-4.25, -2.1, 0, 2.1, 4.25].forEach((x) =>
      columnZ.forEach((z) => slab(2, [0.16, 3, 0.16], [x, 1.9, z], materials.steel, { rise: 2.4 })),
    );
    [-3.05, 3.05].forEach((z) => slab(2, [9, 0.22, 0.22], [0, 3.5, z], materials.steel, { rise: 2.6 }));
    [-4.25, 0, 4.25].forEach((x) => slab(2, [0.22, 0.22, 6.4], [x, 3.5, 0], materials.steel, { rise: 2.6 }));
    slab(2, [9.1, 0.24, 6.5], [0, 3.62, 0], materials.darkSteel, { rise: 2.8 });

    [-2.2, 0.2, 2.4, 4.2].forEach((x) =>
      [-2.6, 0, 2.35].forEach((z) => slab(2, [0.15, 2.5, 0.15], [x, 5, z], materials.steel, { rise: 2.2 })),
    );
    [-2.7, 2.4].forEach((z) => slab(2, [7, 0.2, 0.2], [1, 6.3, z], materials.steel, { rise: 2.4 }));
    [-2.2, 0.2, 2.4, 4.2].forEach((x) => slab(2, [0.2, 0.2, 5.4], [x, 6.3, -0.15], materials.steel, { rise: 2.4 }));

    /* ----------------------------------------------------- stage 3 — enclosure */
    slab(3, [9, 3.05, 6.4], [0, 2.05, 0], materials.stucco, { rise: 1.2 });
    slab(3, [9.4, 0.34, 6.8], [0, 3.72, 0], materials.charcoal, { rise: 1.6 });
    slab(3, [7, 2.62, 5.5], [1, 5.2, -0.2], materials.stucco, { rise: 1.8 });
    slab(3, [7.4, 0.32, 5.9], [1, 6.62, -0.2], materials.charcoal, { rise: 2 });
    slab(3, [3.4, 3.05, 0.24], [-2.95, 2.05, 3.16], materials.charcoal, { rise: 1 });
    slab(3, [2.1, 0.16, 6.2], [-3.45, 3.96, 0], materials.wood, { rise: 1.4 });
    slab(3, [0.85, 2.3, 0.85], [-3.6, 5.05, -2.4], materials.charcoal, { rise: 2.2 });

    /* -------------------------------------------------------- stage 4 — finish */
    slab(4, [3.6, 2.1, 0.08], [2.4, 1.9, 3.26], materials.litGlass, { rise: 0.6, opacity: 0.86 });
    slab(4, [0.12, 2.2, 0.16], [0.55, 1.9, 3.26], materials.steel, { rise: 0.6 });
    slab(4, [1.2, 2.4, 0.12], [-0.35, 1.55, 3.26], materials.wood, { rise: 0.6 });
    slab(4, [2.4, 0.14, 1.5], [-0.3, 2.95, 3.5], materials.charcoal, { rise: 0.9 });
    [-3.6, -2.95, -2.3].forEach((x) => slab(4, [0.5, 1.9, 0.06], [x, 1.5, 3.3], materials.darkSteel, { rise: 0.5 }));

    slab(4, [4.8, 1.8, 0.08], [1.6, 5.15, 2.61], materials.litGlass, { rise: 0.8, opacity: 0.86 });
    [-1.2, 0.4, 2, 3.6].forEach((x) => slab(4, [0.12, 2.5, 0.42], [x, 5.2, 2.78], materials.steel, { rise: 0.9 }));
    slab(4, [0.08, 2.2, 3.4], [4.56, 1.95, -0.8], materials.litGlass, { rise: 0.7, opacity: 0.86 });

    slab(4, [0.08, 1, 6], [-2.5, 4.55, 0], materials.glass, { rise: 0.8, opacity: 0.42 });
    slab(4, [2.2, 0.09, 0.09], [-3.45, 5.06, 0], materials.steel, { rise: 0.8 });
    [-3.1, 3.1].forEach((z) => slab(4, [2.1, 0.08, 0.08], [-3.45, 5.06, z * 0.98], materials.steel, { rise: 0.8 }));

    slab(4, [5.4, 0.36, 2.6], [0, 0.05, -4.3], materials.concrete, { rise: 0.5 });
    slab(4, [4.8, 0.2, 2], [0, 0.16, -4.3], materials.water, { rise: 0.5, opacity: 0.92 });

    for (let index = 0; index < 9; index += 1) {
      const shrub = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.34 + (index % 3) * 0.09, 1),
        materials.foliage.clone(),
      );
      shrub.position.set(-4.4 + index * 1.1, 0.3, index % 2 ? 4 : 3.7);
      register(shrub, 4, { rise: 0.7 });
    }
    [
      [-5, 1.4],
      [5, -1.2],
      [4.5, 3.7],
    ].forEach(([x, z]) => {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 2, 8), materials.trunk.clone());
      trunk.position.set(x, 0.9, z);
      register(trunk, 4, { rise: 0.6 });
      const canopy = new THREE.Mesh(new THREE.IcosahedronGeometry(0.92, 1), materials.foliage.clone());
      canopy.position.set(x, 2.5, z);
      register(canopy, 4, { rise: 0.9 });
    });
    [-5.2, -3.1, 4.6].forEach((x) => slab(4, [0.1, 0.75, 0.1], [x, 0.38, 5.1], materials.warm, { rise: 0.4, opacity: 0.9 }));

    /* ------------------------------------------------------- camera + controls */
    let autoSpin = -0.5;
    let dragOffset = 0;
    let dragging = false;
    let pointerX = 0;
    let currentRotation = -0.5;

    // Sample points on the built envelope, pre-rotated, so the fit holds at every spin angle.
    const fitPoints: THREE.Vector3[] = [];
    for (const angle of [0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4]) {
      for (const x of [-6, 6]) {
        for (const z of [-4.8, 4.8]) {
          for (const y of [-0.2, 7]) {
            fitPoints.push(
              new THREE.Vector3(x * Math.cos(angle) + z * Math.sin(angle), y, -x * Math.sin(angle) + z * Math.cos(angle)),
            );
          }
        }
      }
    }

    const elevation = THREE.MathUtils.degToRad(21);
    const azimuth = THREE.MathUtils.degToRad(34);
    const projected = new THREE.Vector3();

    const fitCamera = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      const aspect = width / height;
      renderer.setSize(width, height, false);
      camera.aspect = aspect;

      // Leave room for the badge above and the stage panel below the model.
      const fillX = 0.98;
      const fillY = height > 460 ? 0.86 : 0.92;
      let distance = FIT_RADIUS / Math.sin(THREE.MathUtils.degToRad(camera.fov) / 2);
      let targetY = FIT_CENTER_Y;

      for (let pass = 0; pass < 14; pass += 1) {
        camera.position.set(
          Math.sin(azimuth) * Math.cos(elevation) * distance,
          targetY + Math.sin(elevation) * distance,
          Math.cos(azimuth) * Math.cos(elevation) * distance,
        );
        camera.lookAt(0, targetY, 0);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld(true);

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        for (const point of fitPoints) {
          projected.copy(point).project(camera);
          minX = Math.min(minX, projected.x);
          maxX = Math.max(maxX, projected.x);
          minY = Math.min(minY, projected.y);
          maxY = Math.max(maxY, projected.y);
        }

        const scale = Math.max((maxX - minX) / (2 * fillX), (maxY - minY) / (2 * fillY));
        const worldPerNdc = distance * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        // Bias the model slightly above centre so the stage panel never covers it.
        targetY += ((minY + maxY) / 2 - 0.06) * worldPerNdc;
        distance *= scale;
        if (Math.abs(scale - 1) < 0.002) break;
      }
    };

    const observer = new ResizeObserver(fitCamera);
    observer.observe(mount);
    fitCamera();

    const canvas = renderer.domElement;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      dragOffset += (event.clientX - pointerX) * 0.007;
      pointerX = event.clientX;
    };
    const onPointerUp = () => {
      dragging = false;
    };
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    /* ------------------------------------------------------------ render loop */
    const startedAt = performance.now();
    let previousTime = startedAt;
    let renderedLevel = -1;
    let frame = 0;

    const render = () => {
      const now = performance.now();
      // Clamped so a backgrounded tab resumes smoothly instead of jumping.
      const delta = Math.min((now - previousTime) / 1000, 0.05);
      previousTime = now;
      const elapsed = (now - startedAt) / 1000;
      const since = (now - levelChangedAtRef.current) / 1000;
      const activeLevel = levelRef.current;

      if (renderedLevel !== activeLevel) {
        // Snapshot where every part stood so the next transition eases from there.
        for (const part of parts) part.from = part.reveal;
        renderedLevel = activeLevel;
      }

      if (!dragging) autoSpin += delta * 0.085;
      currentRotation += (autoSpin + dragOffset - currentRotation) * Math.min(1, delta * 4);
      model.rotation.y = currentRotation;
      model.position.y = Math.sin(elapsed * 0.5) * 0.05;

      for (const part of parts) {
        // Time-driven so a layer always completes within its two-second slot.
        const target = activeLevel >= part.stage && activeLevel <= part.until ? 1 : 0;
        const duration = target ? 0.6 : 0.35;
        const progress = THREE.MathUtils.clamp((since - (target ? part.delay : 0)) / duration, 0, 1);
        const eased = progress * progress * (3 - 2 * progress);
        part.reveal = part.from + (target - part.from) * eased;

        const material = part.mesh.material as THREE.Material & { opacity: number; emissiveIntensity: number };
        material.opacity = part.reveal * part.baseOpacity;
        if (part.baseEmissive) material.emissiveIntensity = part.baseEmissive * part.reveal;
        part.mesh.visible = part.reveal > 0.015;
        part.mesh.position.y = part.baseY + (1 - part.reveal) * part.rise;
        part.mesh.scale.setScalar(0.965 + 0.035 * part.reveal);
      }

      goldGlow.intensity = 18 + Math.sin(elapsed * 1.6) * 4;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        child.geometry.dispose();
        const list = Array.isArray(child.material) ? child.material : [child.material];
        list.forEach((item) => item.dispose());
      });
      Object.values(materials).forEach((material) => (material as THREE.Material).dispose());
      grid.geometry.dispose();
      (grid.material as THREE.Material).dispose();
      environment.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  const stage = STAGES[activeLevel];

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div
        ref={mountRef}
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        role="img"
        aria-label={`Interactive 3D luxury home build sequence, currently showing ${stage.label}`}
      />

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-20 sm:inset-x-5 sm:bottom-5">
        <div className="pointer-events-auto rounded-2xl border border-white/10 bg-[#04101d]/70 p-3 backdrop-blur-md sm:p-4">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[.22em] text-[#e2be6c]">
                Layer {String(activeLevel + 1).padStart(2, "0")} / {String(STAGES.length).padStart(2, "0")} · Drag to orbit
              </p>
              <p className="mt-1 truncate text-sm font-black uppercase tracking-[.04em] text-white">{stage.label}</p>
              <p className="truncate text-[11px] leading-4 text-white/45">{stage.caption}</p>
            </div>
            <span className="hidden shrink-0 items-center gap-2 font-mono text-[8px] uppercase tracking-[.18em] text-white/40 sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-[#d6aa55]" />
              Auto build
            </span>
          </div>

          <div className="mt-3 flex gap-1.5">
            {STAGES.map((item, index) => (
              <button
                key={item.label}
                onClick={() => setLevel(index)}
                aria-label={`Show ${item.label}`}
                aria-current={index === activeLevel}
                className="group h-1.5 flex-1 overflow-hidden rounded-full bg-white/12 transition hover:bg-white/25"
              >
                <motion.span
                  key={`${index}-${activeLevel}`}
                  className="block h-full origin-left rounded-full bg-[#d6aa55]"
                  initial={{ scaleX: index < activeLevel ? 1 : index === activeLevel ? 0 : 0 }}
                  animate={{ scaleX: index <= activeLevel ? 1 : 0 }}
                  transition={{ duration: index === activeLevel ? STAGE_MS / 1000 : 0.25, ease: "linear" }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
