import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Environment } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState, memo } from "react";
import * as THREE from "three";
import ReactDOM from "react-dom";

import { useCanvas, useCanvasLive } from "../context/CanvasContext";
import { cars } from "./hero/carsData";
import { CAMERA_CONFIGS } from "./cameraConfigs";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

gsap.ticker.lagSmoothing(0);

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
const withDraco = (loader) => loader.setDRACOLoader(dracoLoader);

const OFFSCREEN = 18;

/* ================= DEVICE TYPE ================= */

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

/* ================= CAMERA ================= */

function CameraRig({ mode }) {
  const { camera } = useThree();
  const { experienceCamera } = useCanvasLive();
  const device = useDeviceType();

  const defaultCfg = useMemo(() => {
    const byDevice = CAMERA_CONFIGS?.[device] ?? CAMERA_CONFIGS?.desktop;
    const cfg = byDevice?.[mode] ?? byDevice?.home;
    return cfg ?? { pos: [12, 8, 5.5], fov: 12 };
  }, [device, mode]);

  useEffect(() => {
    if (experienceCamera) return;
    gsap.to(camera.position, {
      x: defaultCfg.pos[0],
      y: defaultCfg.pos[1],
      z: defaultCfg.pos[2],
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
      },
    });
    gsap.to(camera, {
      fov: defaultCfg.fov,
      duration: 1.2,
      onUpdate: () => camera.updateProjectionMatrix(),
    });
  }, [experienceCamera, defaultCfg, camera]);

  useEffect(() => {
    if (!experienceCamera) return;
    gsap.to(camera.position, {
      x: experienceCamera.pos[0],
      y: experienceCamera.pos[1],
      z: experienceCamera.pos[2],
      duration: 1.1,
      ease: "power3.out",
      onUpdate: () => {
        camera.lookAt(
          experienceCamera.target[0],
          experienceCamera.target[1],
          experienceCamera.target[2],
        );
        camera.updateProjectionMatrix();
      },
    });
  }, [experienceCamera, camera]);

  return null;
}

/* ================= MODELS ================= */

const ModelsGroup = memo(function ModelsGroup({
  activeCarId,
  warmupAll,
  autoRotate,
  manualRotation,
}) {
  const entries = useMemo(() => Object.entries(cars), []);
  const urls = useMemo(() => entries.map(([, car]) => car.model), [entries]);

  const gltfs = useLoader(GLTFLoader, urls, withDraco);
  const list = Array.isArray(gltfs) ? gltfs : [gltfs];

  const setupDone = useRef(false);
  const groupRef = useRef(null);
  const isTransitioning = useRef(false);

  const { triggerCarTransition, triggerCarTransitionY } = useCanvas();
  const { gl } = useThree();

  //car experience
  useEffect(() => {
    triggerCarTransition.current = (dir, onMidpoint) => {
      if (!groupRef.current || isTransitioning.current) return;
      isTransitioning.current = true;

      const exitX = dir === "next" ? -OFFSCREEN : OFFSCREEN;
      const enterX = dir === "next" ? OFFSCREEN : -OFFSCREEN;
      const exitRotY = dir === "next" ? -0.4 : 0.4;

      gsap.to(gl.domElement, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      });

      gsap.to(groupRef.current.position, {
        x: exitX,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          onMidpoint();
          groupRef.current.position.x = enterX;
          groupRef.current.rotation.y = -exitRotY;

          gsap.to(gl.domElement, {
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
          });

          gsap.to(groupRef.current.position, {
            x: 0,
            duration: 0.55,
            ease: "power2.out",
            onComplete: () => {
              isTransitioning.current = false;
            },
          });
        },
      });

      gsap.to(groupRef.current.rotation, {
        y: exitRotY,
        duration: 0.45,
        ease: "power2.in",
      });
    };
  }, [triggerCarTransition, gl]);

  //home
  useEffect(() => {
    triggerCarTransitionY.current = (dir, onMidpoint) => {
      if (!groupRef.current || isTransitioning.current) return;
      isTransitioning.current = true;

      const exitY = dir === "next" ? 8 : -8;
      const enterY = dir === "next" ? -8 : 8;

      gsap.to(gl.domElement, {
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      });

      gsap.to(groupRef.current.position, {
        y: exitY,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          onMidpoint();
          groupRef.current.position.y = enterY;

          gsap.to(gl.domElement, {
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
          });

          gsap.to(groupRef.current.position, {
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            onComplete: () => {
              isTransitioning.current = false;
            },
          });
        },
      });
    };
  }, [triggerCarTransitionY, gl]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (isTransitioning.current) return;

    if (autoRotate) {
      groupRef.current.rotation.y += delta * 0.3;
      return;
    }

    const t = 1 - Math.exp(-6 * delta);
    let desired;

    if (Array.isArray(manualRotation)) {
      desired = manualRotation;
    } else if (typeof manualRotation === "number") {
      desired = [0, manualRotation, 0];
    } else {
      desired = cars[activeCarId]?.baseRotation ||
        cars[activeCarId]?.experienceBaseRotation || [0, 0, 0];
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      desired[0],
      t,
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      desired[1],
      t,
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      desired[2],
      t,
    );
  });

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

      scene.matrixAutoUpdate = true;
    });
  }, [list, entries]);

  return (
    <group ref={groupRef}>
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

/* ================= WARMUP ================= */

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

/* ================= HOTSPOT TRACKER ================= */

function HotspotTracker({ steps, active }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const { setHotspotPositions } = useCanvasLive();
  const prevPositions = useRef({});

  useFrame(() => {
    if (!groupRef.current || !active) return;

    const newPositions = {};

    steps.forEach((step) => {
      if (!step.hotspot3D) return;

      const vector = new THREE.Vector3(...step.hotspot3D);
      groupRef.current.localToWorld(vector);
      vector.project(camera);

      const x = Number(((vector.x * 0.5 + 0.5) * 100).toFixed(2));
      const y = Number(((-vector.y * 0.5 + 0.5) * 100).toFixed(2));

      newPositions[step.key] = { x, y };
    });

    const prev = prevPositions.current;
    const changed = steps.some((step) => {
      const p = prev[step.key];
      const n = newPositions[step.key];
      if (!p || !n) return true;
      return p.x !== n.x || p.y !== n.y;
    });

    if (changed) {
      prevPositions.current = newPositions;
      setHotspotPositions(newPositions);
    }
  });

  return <group ref={groupRef} />;
}

/* ================= DEBUG CAMERA ================= */

function DebugCamera() {
  const { camera, scene } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const DISTANCE = 1.2;

  useEffect(() => {
    const handleClick = (event) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const intersects = raycaster.current.intersectObjects(
        scene.children,
        true,
      );

      if (intersects.length > 0) {
        const point = intersects[0].point;
        const direction = new THREE.Vector3()
          .subVectors(camera.position, point)
          .normalize();
        const camPos = new THREE.Vector3()
          .copy(point)
          .add(direction.multiplyScalar(DISTANCE));

        console.log(
          JSON.stringify(
            {
              camera: {
                pos: [
                  Number(camPos.x.toFixed(3)),
                  Number(camPos.y.toFixed(3)),
                  Number(camPos.z.toFixed(3)),
                ],
                target: [
                  Number(point.x.toFixed(3)),
                  Number(point.y.toFixed(3)),
                  Number(point.z.toFixed(3)),
                ],
              },
              hotspot3D: [
                Number(point.x.toFixed(3)),
                Number(point.y.toFixed(3)),
                Number(point.z.toFixed(3)),
              ],
            },
            null,
            2,
          ),
        );
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [camera, scene]);

  return null;
}

/* ================= HOTSPOT OVERLAY HTML ================= */

function HotspotOverlayHTML({ activeStep }) {
  const { experienceSteps, onStepClick } = useCanvas();
  const { hotspotPositions } = useCanvasLive();

  if (!onStepClick || !experienceSteps.length) return null;

  return ReactDOM.createPortal(
    <div
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 10 }}
      className={activeStep ? "hotspots-hidden" : ""}
    >
      {experienceSteps.map((step) => {
        const pos = hotspotPositions?.[step.key];
        if (!pos || !step.hotspot3D) return null;

        return (
          <button
            key={step.key}
            className="hotspot"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              position: "absolute",
              transform: "translate(-50%, -50%)",
              pointerEvents: "all",
            }}
            onClick={() => onStepClick(step)}
          />
        );
      })}
    </div>,
    document.body,
  );
}

/* ================= MAIN ================= */

export default function GlobalCanvas({ onReady, activeStep }) {
  const { activeCarId, mode, experienceSteps, onStepClick, hotspotsReady } =
    useCanvas();
  const { experienceRotation } = useCanvasLive();

  const device = useDeviceType();
  const isMobile = device === "mobile";

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

  const showHotspots =
    mode === "experience" &&
    !isMobile &&
    onStepClick &&
    experienceSteps.length > 0 &&
    hotspotsReady;

  return (
    <>
      <Canvas
        shadows={false}
        dpr={1.5}
        gl={{
          powerPreference: "high-performance",
          antialias: true,
          preserveDrawingBuffer: false,
        }}
      >
        <CameraRig mode={mode} />
        <Suspense fallback={null}>
          <ModelsGroup
            activeCarId={currentId}
            warmupAll={warmupAll}
            autoRotate={mode === "hero"}
            manualRotation={mode === "experience" ? experienceRotation : null}
          />
          <Environment
            preset="sunset"
            background={false}
            environmentIntensity={1}
          />
          <Warmup onDone={finish} />
          {showHotspots && (
            <HotspotTracker steps={experienceSteps} active={!activeStep} />
          )}
        </Suspense>
        {import.meta.env.DEV && mode === "experience" && <DebugCamera />}
      </Canvas>
      {showHotspots && <HotspotOverlayHTML activeStep={activeStep} />}
    </>
  );
}
