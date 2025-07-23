import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import AnimatedModel from "./AnimatedModel";
import useLang from "../context/useLang";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "../styles/hero.css";

const cars = [
  {
    name: "Dodge Charger",
    model: "/assets/cars/dodge-charger/source/dodge_charger.glb",
    scale: 0.9,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "V8 HEMI", displacement: "6200cc", price: "€70 000" },
  },
  {
    name: "Nissan Skyline",
    model: "/assets/cars/nissan-skyline/source/nissan_skyline.glb",
    scale: 105,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "RB26DETT", displacement: "2600cc", price: "€90 000" },
  },
];

export default function Hero() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const statsRef = useRef(null);
  const cameraPosition = useMemo(() => {
    return window.innerWidth <= 768 ? [0, 0.7, 7] : [0, 0.7, 5];
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    gsap.fromTo(
      statsRef.current.querySelectorAll("p, h2"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [active]);

  return (
    <section className="hero container">
      <Swiper
        modules={[Navigation, EffectFade]}
        navigation
        effect="fade"
        onSlideChange={(sw) => setActive(sw.activeIndex)}
        className="swiper"
      >
        {cars.map((car) => (
          <SwiperSlide key={car.model}></SwiperSlide>
        ))}
      </Swiper>

      {/* Canvas unico */}
      <div className="model-view">
        <Canvas shadows camera={{ position: cameraPosition, fov: 45 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <AnimatedModel
              key={cars[active].model}
              modelPath={cars[active].model}
              scaleFactor={cars[active].scale}
              rotation={cars[active].rotation}
              offset={cars[active].offset}
            />
          </Suspense>
          <ContactShadows
            position={[0, -0.01, 0]}
            opacity={0.6}
            blur={1.5}
            scale={10}
            far={5}
            resolution={1024}
          />
          <OrbitControls makeDefault enableZoom={false} enablePan={false} />
          <Environment preset="sunset" />
        </Canvas>
      </div>

      {/* Statistiche */}
      <div className="car-stats" ref={statsRef}>
        <h2>{cars[active].name}</h2>
        <div className="description">
          <p>
            {t.car.engine}: {cars[active].stats.engine}
          </p>
          <p>
            {t.car.displacement}: {cars[active].stats.displacement}
          </p>
          <p>
            {t.car.price}: {cars[active].stats.price}
          </p>
        </div>
      </div>
    </section>
  );
}
