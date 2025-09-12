import { Canvas, useThree, useLoader } from "@react-three/fiber";
import gsap from "gsap";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, memo, useMemo } from "react";
import { useCanvas } from "../context/CanvasContext";
import { cars } from "./hero/carsData";
import Loader3D from "./Loader3D";
import { CAMERA_CONFIGS } from "./cameraConfigs";
import * as THREE from "three";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const Model = memo(function Model({ car }) {
  const gltf = useLoader(GLTFLoader, car.model, (loader) => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
  });

  const { scene } = gltf;

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    scene.position.sub(center);
    const height = box.max.y - box.min.y;
    scene.position.y += height * 0.5;
    if (car?.offset) {
      scene.position.add(new THREE.Vector3(...car.offset));
    }
  }, [scene, car?.offset]);

  return (
    <primitive
      object={scene}
      scale={car.scale}
      rotation={car.rotation}
      position={car.offset}
    />
  );
});

const Shadows = memo(() => (
  <ContactShadows
    position={[0, -0.01, 0]}
    opacity={0.4}
    blur={0.8}
    scale={14}
    far={8}
  />
));

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

function CameraRig({ mode }) {
  const { camera } = useThree();
  const device = useDeviceType();

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

  if (mode === "hidden") return null;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ powerPreference: "high-performance", antialias: true }}
      camera={{ position: [12, 8, 5.5], fov: 12 }}
    >
      <CameraRig mode={mode} />

      <Suspense
        fallback={
          <Html center>
            <Loader3D />
          </Html>
        }
      >
        {activeCarId && <Model car={cars[activeCarId]} />}
      </Suspense>

      <Shadows />
      <HeroControls enabled={mode === "hero"} />

      <Environment preset="sunset" background={false} />
    </Canvas>
  );
}
