import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect } from "react";
import AnimatedModel from "../AnimatedModel";
import Loader3D from "../Loader3D";

export default function CarCanvas({ car, cameraPosition, cars, active }) {
  // Preload dinamico del modello attivo
  useEffect(() => {
    if (!car) return;

    // preload del modello attuale
    useGLTF.preload(car.model);

    // preload next & prev
    const next = cars[active + 1];
    const prev = cars[active - 1];
    if (next) useGLTF.preload(next.model);
    if (prev) useGLTF.preload(prev.model);
  }, [car, cars, active]);

  return (
    <div className="model-view">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ powerPreference: "high-performance", antialias: true }}
        camera={{ position: cameraPosition, fov: 45 }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} />

        <Suspense
          fallback={
            <Html center>
              <Loader3D />
            </Html>
          }
        >
          <AnimatedModel
            key={car.model}
            modelPath={car.model}
            scaleFactor={car.scale}
            rotation={car.rotation}
            offset={car.offset}
            shadows={false}
            inDuration={0.8}
          />
        </Suspense>

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          blur={1.2}
          scale={10}
          far={5}
          resolution={512}
        />

        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
