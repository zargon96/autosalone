import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Html,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, memo } from "react";
import Loader3D from "../Loader3D";
import gsap from "gsap";

const AnimatedModel = memo(function AnimatedModel({ car }) {
  const { scene } = useGLTF(car.model);
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;
    gsap.set(ref.current.scale, { x: 0, y: 0, z: 0 });
    gsap.to(ref.current.scale, {
      x: car.scale,
      y: car.scale,
      z: car.scale,
      duration: 1,
      ease: "power3.out",
    });
  }, [car]);

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={car.scale}
      rotation={car.rotation}
      position={car.offset}
    />
  );
});

export default function CarCanvas({ car, cameraPosition }) {
  if (!car) return null;

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
          <AnimatedModel car={car} />
        </Suspense>

        <ContactShadows
          position={[0, -0.01, 0]}
          opacity={0.5}
          blur={1.2}
          scale={10}
          far={5}
          resolution={512}
        />

        <OrbitControls makeDefault enableZoom={true} enablePan={false} />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}
