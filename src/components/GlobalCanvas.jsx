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

/* draco loader created once to avoid re-instantiation on every model load */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
const withDraco = (loader) => loader.setDRACOLoader(dracoLoader);

/* preload all car models to avoid loading stalls during scroll/model switch */
Object.values(cars).forEach((car) => {
  useLoader.preload(GLTFLoader, car.model, withDraco);
});

/* single car model renderer */
const Model = memo(function Model({ car, visible }) {
  const gltf = useLoader(GLTFLoader, car.model, withDraco);
  const { scene } = gltf;

  /* center the model and lift it so it sits correctly in the scene */
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);

    const height = box.max.y - box.min.y;
    scene.position.y += height * 0.5;

    /* apply optional per-model offset from data */
    if (car?.offset) {
      scene.position.add(new THREE.Vector3(...car.offset));
    }
  }, [scene, car?.offset]);

  return (
    <primitive
      object={scene}
      visible={visible}
      scale={car.scale}
      rotation={car.rotation}
      position={car.offset}
      dispose={null}
    />
  );
});

/* renders all models once and switches visibility instead of mounting/unmounting */
const ModelsGroup = memo(function ModelsGroup({ activeCarId }) {
  return (
    <group>
      {Object.entries(cars).map(([id, car]) => (
        <Model key={id} car={car} visible={id === activeCarId} />
      ))}
    </group>
  );
});

/* detects device type to select responsive camera configs */
function useDeviceType() {
  const [device, setDevice] = useState(() => {
    const w = window.innerWidth;
    if (w <= 768) return "mobile";
    if (w <= 1536) return "smallLaptop";
    return "desktop";
  });

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w <= 768) setDevice("mobile");
      else if (w <= 1536) setDevice("smallLaptop");
      else setDevice("desktop");
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return device;
}

/* animates camera position and fov based on mode and device */
function CameraRig({ mode }) {
  const { camera } = useThree();
  const device = useDeviceType();

  /* pick the correct camera configuration */
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

  /* smooth camera transition using gsap */
  useEffect(() => {
    gsap.to(camera.position, {
      x: targetCfg.pos[0],
      y: targetCfg.pos[1],
      z: targetCfg.pos[2],
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      },
    });

    gsap.to(camera, {
      fov: targetCfg.fov,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [camera, targetCfg]);

  return null;
}

/* orbit controls enabled only in hero mode */
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

/* main canvas component */
export default function GlobalCanvas() {
  const { activeCarId, mode } = useCanvas();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        powerPreference: "high-performance",
        antialias: true,
        preserveDrawingBuffer: false,
      }}
    >
      <CameraRig mode={mode} />

      {/* suspense used only once, models are already preloaded */}
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
