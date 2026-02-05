import { Canvas, useThree, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, memo, useMemo } from "react";
import { useCanvas } from "../context/CanvasContext";
import { cars } from "./hero/carsData";
import Loader3D from "./Loader3D";
import { CAMERA_CONFIGS } from "./cameraConfigs";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

gsap.ticker.lagSmoothing(0);

/* draco loader is created once to avoid re-instantiation */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
const withDraco = (loader) => loader.setDRACOLoader(dracoLoader);

/* renders a single car model */
const Model = memo(function Model({ car, visible }) {
  const gltf = useLoader(GLTFLoader, car.model, withDraco);
  const { scene } = gltf;

  /* ensure expensive setup runs only once */
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    /* center model geometry */
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    /* lift model so it sits correctly on the ground */
    const height = box.max.y - box.min.y;
    scene.position.y += height * 0.5;

    /* optional per-model offset from data */
    if (car?.offset) {
      scene.position.add(new THREE.Vector3(...car.offset));
    }

    /* micro-optimizations: static meshes */
    scene.traverse((obj) => {
      if (obj.isMesh) {
        obj.frustumCulled = true;
        obj.matrixAutoUpdate = false;
        obj.updateMatrix();
      }
    });
  }, [scene, car]);

  return (
    <primitive
      object={scene}
      visible={visible}
      scale={car.scale}
      rotation={car.rotation}
      dispose={null}
    />
  );
});

/* all models are mounted once, only visibility changes */
const ModelsGroup = memo(function ModelsGroup({ activeCarId }) {
  return (
    <group>
      {Object.entries(cars).map(([id, car]) => (
        <Model key={id} car={car} visible={id === activeCarId} />
      ))}
    </group>
  );
});

/* detect device type to select responsive camera configs */
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

/* animates camera position and FOV based on mode and device */
function CameraRig({ mode }) {
  const { camera } = useThree();
  const device = useDeviceType();

  /* reuse lookAt vector to avoid allocations */
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  /* select correct camera configuration */
  const targetCfg = useMemo(() => {
    if (device === "mobile")
      return mode === "hero"
        ? CAMERA_CONFIGS.mobile.hero
        : CAMERA_CONFIGS.mobile.home;
    if (device === "smallLaptop")
      return mode === "hero"
        ? CAMERA_CONFIGS.smallLaptop.hero
        : CAMERA_CONFIGS.smallLaptop.home;
    return mode === "hero"
      ? CAMERA_CONFIGS.desktop.hero
      : CAMERA_CONFIGS.desktop.home;
  }, [device, mode]);

  useEffect(() => {
    /* kill previous tweens to avoid accumulation */
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera);

    /* animate camera position */
    gsap.to(camera.position, {
      x: targetCfg.pos[0],
      y: targetCfg.pos[1],
      z: targetCfg.pos[2],
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => camera.lookAt(lookTarget),
    });

    /* animate FOV and update projection once */
    gsap.to(camera, {
      fov: targetCfg.fov,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => camera.updateProjectionMatrix(),
    });
  }, [camera, targetCfg, lookTarget]);

  return null;
}

/* orbitControls enabled only in hero mode */
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

export default function GlobalCanvas() {
  const { activeCarId, mode } = useCanvas();

  /* preload NEXT model only, executed when browser is idle */
  useEffect(() => {
    if (!activeCarId) return;

    const ids = Object.keys(cars);
    const index = ids.indexOf(activeCarId);
    if (index === -1) return;

    const nextId = ids[index + 1];
    if (!nextId) return;

    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));

    idle(() => {
      useLoader.preload(GLTFLoader, cars[nextId].model, withDraco);
    });
  }, [activeCarId]);

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

      {/* suspense used once, models are mounted persistently */}
      <Suspense
        fallback={
          <Html center>
            <Loader3D />
          </Html>
        }
      >
        <ModelsGroup activeCarId={activeCarId} />
      </Suspense>

      <HeroControls enabled={mode === "hero"} />
      <Environment preset="sunset" background={false} />
    </Canvas>
  );
}
