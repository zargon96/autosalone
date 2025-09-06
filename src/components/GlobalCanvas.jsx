import { Canvas, useThree } from "@react-three/fiber";
import gsap from "gsap";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, memo } from "react";
import { useCanvas } from "../context/CanvasContext";
import { cars } from "./hero/carsData";
import Loader3D from "./Loader3D";

const Model = memo(function Model({ car }) {
  const { scene } = useGLTF(car.model);
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

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isMobile;
}

function CameraRig({ mode }) {
  const { camera } = useThree();
  const isMobile = useIsMobile();

  useEffect(() => {
    const HOME_DESKTOP = { pos: [12, 8, 5.5], fov: 12 };
    const HERO_DESKTOP = { pos: [-2.5, 3, 6], fov: 26 };

    const HOME_MOBILE = { pos: [12, 8, 5.5], fov: 22 };
    const HERO_MOBILE = { pos: [-2, 2.5, 5], fov: 30 };

    const targetCfg = isMobile
      ? mode === "hero"
        ? HERO_MOBILE
        : HOME_MOBILE
      : mode === "hero"
      ? HERO_DESKTOP
      : HOME_DESKTOP;

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
  }, [mode, camera, isMobile]);

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
