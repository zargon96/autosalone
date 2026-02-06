import { Canvas, useThree, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, memo } from "react";
import * as THREE from "three";

import { useCanvas } from "../context/CanvasContext";
import { cars } from "./hero/carsData";
import { CAMERA_CONFIGS } from "./cameraConfigs";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

gsap.ticker.lagSmoothing(0);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
const withDraco = (loader) => loader.setDRACOLoader(dracoLoader);

function useDeviceType() {
  const [device, setDevice] = useState(() => {
    const w = window.innerWidth;
    if (w <= 768) return "mobile";
    if (w <= 1536) return "smallLaptop";
    return "desktop";
  });

  useEffect(() => {
    let ticking = false;

    const onResize = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const w = window.innerWidth;
        if (w <= 768) setDevice("mobile");
        else if (w <= 1536) setDevice("smallLaptop");
        else setDevice("desktop");
        ticking = false;
      });
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return device;
}

function CameraRig({ mode }) {
  const { camera } = useThree();
  const device = useDeviceType();
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  const targetCfg = useMemo(() => {
    const byDevice = CAMERA_CONFIGS?.[device] ?? CAMERA_CONFIGS?.desktop;
    const cfg = byDevice?.[mode] ?? byDevice?.home;
    return cfg ?? { pos: [12, 8, 5.5], fov: 12 };
  }, [device, mode]);

  useEffect(() => {
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera);

    gsap.to(camera.position, {
      x: targetCfg.pos[0],
      y: targetCfg.pos[1],
      z: targetCfg.pos[2],
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => camera.lookAt(lookTarget),
    });

    gsap.to(camera, {
      fov: targetCfg.fov,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => camera.updateProjectionMatrix(),
    });
  }, [camera, targetCfg, lookTarget]);

  return null;
}

function HeroControls({ enabled }) {
  const ref = useRef(null);

  useEffect(() => {
    if (enabled && ref.current) {
      ref.current.target.set(0, 0, 0);
      ref.current.update();
    }
  }, [enabled]);

  if (!enabled) return null;
  return <OrbitControls ref={ref} makeDefault enableZoom enablePan={false} />;
}

const ModelsGroup = memo(function ModelsGroup({ activeCarId, warmupAll }) {
  const entries = useMemo(() => Object.entries(cars), []);
  const urls = useMemo(() => entries.map(([, car]) => car.model), [entries]);

  const gltfs = useLoader(GLTFLoader, urls, withDraco);
  const list = Array.isArray(gltfs) ? gltfs : [gltfs];

  const setupDone = useRef(false);

  useEffect(() => {
    if (setupDone.current) return;
    setupDone.current = true;

    list.forEach((gltf, idx) => {
      const car = entries[idx][1];
      const scene = gltf.scene;

      const box = new THREE.Box3().setFromObject(scene);
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center);

      const height = box.max.y - box.min.y;
      scene.position.y += height * 0.5;

      if (car?.offset) {
        scene.position.add(new THREE.Vector3(...car.offset));
      }

      scene.traverse((obj) => {
        if (obj.isMesh) {
          obj.frustumCulled = true;
          obj.matrixAutoUpdate = false;
          obj.updateMatrix();
        }
      });
    });
  }, [list, entries]);

  return (
    <group>
      {entries.map(([id, car], idx) => (
        <primitive
          key={id}
          object={list[idx].scene}
          visible={warmupAll ? true : id === activeCarId}
          scale={car.scale}
          rotation={car.rotation}
          dispose={null}
        />
      ))}
    </group>
  );
});

function Warmup({ onDone }) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;

    raf1 = requestAnimationFrame(() => {
      try {
        gl.compile(scene, camera);
      } catch {}

      raf2 = requestAnimationFrame(() => {
        onDone?.();
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [gl, scene, camera, onDone]);

  return null;
}

export default function GlobalCanvas({ onReady }) {
  const { activeCarId, mode } = useCanvas();

  const firstId = useMemo(() => Object.keys(cars)[0], []);
  const currentId = activeCarId || firstId;

  const [warmupAll, setWarmupAll] = useState(true);
  const readyOnce = useRef(false);

  const finish = () => {
    if (readyOnce.current) return;
    readyOnce.current = true;
    setWarmupAll(false);
    if (typeof onReady === "function") onReady();
  };

  return (
    <Canvas
      shadows={false}
      dpr={[1, 1.5]}
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        preserveDrawingBuffer: false,
      }}
    >
      <CameraRig mode={mode} />

      <Suspense fallback={null}>
        <ModelsGroup activeCarId={currentId} warmupAll={warmupAll} />
        <Environment preset="sunset" background={false} />
        <Warmup onDone={finish} />
      </Suspense>

      <HeroControls enabled={mode === "hero"} />
    </Canvas>
  );
}
