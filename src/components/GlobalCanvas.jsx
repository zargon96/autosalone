import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import useCanvas from "../context/CanvasContext";
import { cars } from "./hero/carsData";
import Loader3D from "./Loader3D";

function Model({ car, visible }) {
  const { scene } = useGLTF(car.model);
  return (
    <primitive
      object={scene}
      scale={car.scale}
      rotation={car.rotation}
      position={car.offset}
      visible={visible}
    />
  );
}

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
    const HERO_MOBILE = { pos: [-2, 2.5, 5], fov: 38 };

    const targetCfg = isMobile
      ? mode === "hero"
        ? HERO_MOBILE
        : HOME_MOBILE
      : mode === "hero"
      ? HERO_DESKTOP
      : HOME_DESKTOP;

    const dur = 0.35;
    let t = 0;
    let raf;
    const startPos = camera.position.clone();
    const startFov = camera.fov;

    const step = () => {
      t += 1 / 60 / dur;
      const a = t >= 1 ? 1 : t;

      camera.position.set(
        startPos.x + (targetCfg.pos[0] - startPos.x) * a,
        startPos.y + (targetCfg.pos[1] - startPos.y) * a,
        startPos.z + (targetCfg.pos[2] - startPos.z) * a
      );
      camera.fov = startFov + (targetCfg.fov - startFov) * a;

      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();

      if (a < 1) raf = requestAnimationFrame(step);
    };

    step();
    return () => raf && cancelAnimationFrame(raf);
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
  const carKeys = useMemo(() => Object.keys(cars), []);
  if (mode === "hidden") return null;

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ powerPreference: "high-performance", antialias: true }}
      camera={{ position: [12, 8, 5.5], fov: 12 }}
    >
      <CameraRig mode={mode} />

      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 8, 6]} intensity={2.2} castShadow />
      <directionalLight position={[-6, 4, -3]} intensity={1.0} />
      <directionalLight position={[0, 6, -6]} intensity={1.4} />

      <Suspense
        fallback={
          <Html center>
            <Loader3D />
          </Html>
        }
      >
        {carKeys.map((key) => (
          <Model
            key={cars[key].id}
            car={cars[key]}
            visible={cars[key].id === activeCarId}
          />
        ))}
      </Suspense>

      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.4}
        blur={0.8}
        scale={14}
        far={8}
      />

      <HeroControls enabled={mode === "hero"} />
      {mode === "hero" && <Environment preset="sunset" />}
    </Canvas>
  );
}
