import { Canvas, useThree, useLoader, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { Environment } from "@react-three/drei";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  memo,
  useCallback,
} from "react";
import * as THREE from "three";
import ReactDOM from "react-dom";

import { useCanvas, useCanvasLive } from "../../context/CanvasContext";
import { cars } from "../cars/carsData";
import { CAMERA_CONFIGS } from "./cameraConfigs";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

gsap.ticker.lagSmoothing(0);

const dracoLoader = new DRACOLoader();

dracoLoader.setDecoderPath("/draco/");

const withDraco = (loader) => {
  loader.setDRACOLoader(dracoLoader);
  loader.setMeshoptDecoder(MeshoptDecoder);
};

const OFFSCREEN_X = 18;
const OFFSCREEN_Y = 8;

/* ================= PRELOAD ================= */

const CAR_ENTRIES = Object.entries(cars);
const CAR_URLS = CAR_ENTRIES.map(([, car]) => car.model);

useLoader.preload(GLTFLoader, CAR_URLS, withDraco);

/* ================= HOTSPOT DOM REFS ================= */
// Riferimenti diretti ai bottoni degli hotspot: il tracker li muove
// scrivendo nel DOM, senza passare da setState a ogni frame.

const hotspotEls = { current: {} };

const hotspotTransform = (x, y) =>
  `translate3d(${x}vw, ${y}vh, 0) translate(-50%, -50%)`;

/* ================= DEVICE TYPE ================= */
// Un solo listener di resize condiviso da tutti i componenti.

const getDevice = () => {
  const w = window.innerWidth;
  if (w <= 768) return "mobile";
  if (w <= 1536) return "smallLaptop";
  return "desktop";
};

const deviceListeners = new Set();
let deviceSnapshot = getDevice();
let deviceTicking = false;

const onDeviceResize = () => {
  if (deviceTicking) return;
  deviceTicking = true;
  requestAnimationFrame(() => {
    deviceTicking = false;
    const next = getDevice();
    if (next !== deviceSnapshot) {
      deviceSnapshot = next;
      deviceListeners.forEach((cb) => cb());
    }
  });
};

const subscribeDevice = (cb) => {
  if (deviceListeners.size === 0) {
    deviceSnapshot = getDevice();
    window.addEventListener("resize", onDeviceResize, { passive: true });
  }
  deviceListeners.add(cb);
  return () => {
    deviceListeners.delete(cb);
    if (deviceListeners.size === 0) {
      window.removeEventListener("resize", onDeviceResize);
    }
  };
};

const getDeviceSnapshot = () => deviceSnapshot;

function useDeviceType() {
  return useSyncExternalStore(
    subscribeDevice,
    getDeviceSnapshot,
    getDeviceSnapshot,
  );
}

/* ================= CAMERA ================= */

function CameraRig({ mode, device }) {
  const { camera } = useThree();
  const { experienceCamera } = useCanvasLive();

  const defaultCfg = useMemo(() => {
    const byDevice = CAMERA_CONFIGS?.[device] ?? CAMERA_CONFIGS?.desktop;
    const cfg = byDevice?.[mode] ?? byDevice?.home;
    return cfg ?? { pos: [12, 8, 5.5], fov: 12 };
  }, [device, mode]);

  useEffect(() => {
    if (experienceCamera) return;
    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(camera);
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
    gsap.killTweensOf(camera.position);
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

/* ================= MODELS GROUP ================= */

const ModelsGroup = memo(function ModelsGroup({
  activeCarId,
  warmupDone,
  autoRotate,
  manualRotation,
}) {
  // Stessi URL (stesso ordine) del preload a livello modulo -> cache hit
  const gltfs = useLoader(GLTFLoader, CAR_URLS, withDraco);
  const list = Array.isArray(gltfs) ? gltfs : [gltfs];

  const setupDone = useRef(false);
  const groupRef = useRef(null);
  const isTransitioning = useRef(false);
  const pendingTransition = useRef(null);

  const { triggerCarTransition, triggerCarTransitionY } = useCanvas();
  const { gl } = useThree();

  /* ---- Transizione unica (asse "x" o "y") ---- */
  const runTransition = useCallback(
    (axis, dir, onMidpoint) => {
      const group = groupRef.current;
      if (!group) return;

      pendingTransition.current = null;

      gsap.killTweensOf(gl.domElement);
      gsap.killTweensOf(group.position);
      gsap.killTweensOf(group.rotation);

      isTransitioning.current = true;

      const isX = axis === "x";
      const sign = dir === "next" ? 1 : -1;
      const offscreen = isX ? OFFSCREEN_X : OFFSCREEN_Y;
      // su X "next" esce a sinistra, su Y "next" esce in alto
      const exitPos = (isX ? -sign : sign) * offscreen;
      const enterPos = -exitPos;
      const exitRotY = -sign * 0.4;

      const finish = () => {
        isTransitioning.current = false;
        const p = pendingTransition.current;
        if (p) runTransition(p.axis, p.dir, p.onMidpoint);
      };

      gsap.to(gl.domElement, { opacity: 0, duration: 0.45, ease: "power2.in" });

      if (isX) {
        gsap.to(group.rotation, {
          y: exitRotY,
          duration: 0.45,
          ease: "power2.in",
        });
      }

      gsap.to(group.position, {
        [axis]: exitPos,
        duration: 0.45,
        ease: "power2.in",
        onComplete: () => {
          onMidpoint();
          group.position[axis] = enterPos;
          if (isX) group.rotation.y = -exitRotY;

          gsap.to(gl.domElement, {
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
          });
          gsap.to(group.position, {
            [axis]: 0,
            duration: 0.55,
            ease: "power2.out",
            onComplete: finish,
          });
        },
      });
    },
    [gl],
  );

  useEffect(() => {
    triggerCarTransition.current = (dir, onMidpoint) => {
      if (isTransitioning.current) {
        pendingTransition.current = { axis: "x", dir, onMidpoint };
        return;
      }
      runTransition("x", dir, onMidpoint);
    };
  }, [triggerCarTransition, runTransition]);

  useEffect(() => {
    triggerCarTransitionY.current = (dir, onMidpoint) => {
      if (isTransitioning.current) {
        pendingTransition.current = { axis: "y", dir, onMidpoint };
        return;
      }
      runTransition("y", dir, onMidpoint);
    };
  }, [triggerCarTransitionY, runTransition]);

  const desiredRef = useRef([0, 0, 0]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group || isTransitioning.current) return;

    if (autoRotate) {
      group.rotation.y += delta * 0.3;
      return;
    }

    const t = 1 - Math.exp(-6 * delta);

    desiredRef.current = Array.isArray(manualRotation)
      ? manualRotation
      : typeof manualRotation === "number"
        ? [0, manualRotation, 0]
        : cars[activeCarId]?.baseRotation ||
          cars[activeCarId]?.experienceBaseRotation || [0, 0, 0];

    const d = desiredRef.current;
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, d[0], t);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, d[1], t);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, d[2], t);
  });

  useEffect(() => {
    if (setupDone.current) return;
    setupDone.current = true;

    list.forEach((gltf, idx) => {
      const car = CAR_ENTRIES[idx][1];
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
  }, [list]);

  return (
    <group ref={groupRef}>
      {CAR_ENTRIES.map(([id, car], idx) => (
        <primitive
          key={id}
          object={list[idx].scene}
          visible={!warmupDone ? true : id === activeCarId}
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
    let cancelled = false;

    gl.compileAsync(scene, camera)
      .then(() => {
        if (!cancelled) onDone?.();
      })
      .catch(() => {
        if (!cancelled) onDone?.();
      });

    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, onDone]);

  return null;
}

/* ================= HOTSPOT TRACKER ================= */

function HotspotTracker({ steps, active }) {
  const { camera } = useThree();
  const groupRef = useRef();
  const { setHotspotPositions } = useCanvasLive();
  const vectorRef = useRef(new THREE.Vector3());
  const reportedRef = useRef(false);

  // Se cambiano gli step, la prima posizione va ri-comunicata al context
  useEffect(() => {
    reportedRef.current = false;
  }, [steps]);

  useFrame(() => {
    if (!groupRef.current || !active) return;

    const positions = {};

    steps.forEach((step) => {
      if (!step.hotspot3D) return;

      vectorRef.current.set(...step.hotspot3D);
      groupRef.current.localToWorld(vectorRef.current);
      vectorRef.current.project(camera);

      const x = (vectorRef.current.x * 0.5 + 0.5) * 100;
      const y = (-vectorRef.current.y * 0.5 + 0.5) * 100;

      positions[step.key] = { x, y };

      // Aggiornamento diretto del DOM: zero re-render di React
      const el = hotspotEls.current[step.key];
      if (el) el.style.transform = hotspotTransform(x, y);
    });

    // setState UNA sola volta (serve a far comparire i bottoni),
    // poi ci pensa il DOM.
    if (!reportedRef.current) {
      reportedRef.current = true;
      setHotspotPositions(positions);
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

/* ================= HOTSPOT OVERLAY ================= */

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
            ref={(el) => {
              if (el) {
                hotspotEls.current[step.key] = el;
                // posizione iniziale; poi la aggiorna il tracker ogni frame
                el.style.transform = hotspotTransform(pos.x, pos.y);
              } else {
                delete hotspotEls.current[step.key];
              }
            }}
            style={{
              left: 0,
              top: 0,
              position: "absolute",
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

  const firstId = CAR_ENTRIES[0]?.[0];
  const currentId = activeCarId || firstId;

  const [warmupDone, setWarmupDone] = useState(false);
  const readyOnce = useRef(false);

  const handleWarmupDone = useCallback(() => {
    if (readyOnce.current) return;
    readyOnce.current = true;
    setWarmupDone(true);
    onReady?.();
  }, [onReady]);

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
        dpr={isMobile ? 1 : 1.5}
        gl={{
          powerPreference: "high-performance",
          antialias: !isMobile,
          preserveDrawingBuffer: false,
        }}
        style={{ willChange: "opacity" }}
      >
        <CameraRig mode={mode} device={device} />
        <Suspense fallback={null}>
          <ModelsGroup
            activeCarId={currentId}
            warmupDone={warmupDone}
            autoRotate={mode === "hero"}
            manualRotation={mode === "experience" ? experienceRotation : null}
          />
          <Environment
            files="/venice_sunset_1k.hdr"
            background={false}
            environmentIntensity={1}
            resolution={16}
            frames={1}
          />
          <Warmup onDone={handleWarmupDone} />
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
