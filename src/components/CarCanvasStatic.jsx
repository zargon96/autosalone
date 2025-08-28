import { Canvas } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { cars } from "../components/hero/carsData";
import { Html } from "@react-three/drei";
import Loader3D from "./Loader3D";

function Model({ car, sideView, visible }) {
  const { scene } = useGLTF(car.model);
  const rotation = sideView ? [0, -Math.PI / 2, 0] : car.rotation;

  return (
    <primitive
      object={scene}
      scale={car.scale}
      rotation={rotation}
      position={car.offset}
      visible={visible}
    />
  );
}

export default function CarCanvasStatic({ activeIndex, sideView = false }) {
  const carKeys = Object.keys(cars);
  const fovValue = useMemo(() => {
    return window.innerWidth <= 768 ? 55 : 28;
  }, []);

  return (
    <div className="model-view">
      <Canvas
        shadows
        frameloop="demand"
        dpr={[1, 2]}
        gl={{
          toneMappingExposure: 1.5,
          powerPreference: "high-performance",
          antialias: true,
          preserveDrawingBuffer: false,
        }}
        camera={{ position: [0, 4, 6], fov: fovValue }}
        onCreated={({ gl }) => {
          const canvas = gl.getContext().canvas;
          canvas.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            console.warn("WebGL context lost");
          });
          canvas.addEventListener("webglcontextrestored", () => {
            console.warn("WebGL context restored");
          });
        }}
      >
        <hemisphereLight
          intensity={1.2}
          skyColor="#ffffff"
          groundColor="#666666"
        />
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
          {carKeys.map((key, i) => (
            <Model
              key={cars[key].id}
              car={cars[key]}
              sideView={sideView}
              visible={i === activeIndex}
            />
          ))}
        </Suspense>
        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.35}
          blur={0.5}
          scale={14}
          far={8}
          resolution={256}
          frames={1}
        />
      </Canvas>
    </div>
  );
}
