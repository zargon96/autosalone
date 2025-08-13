import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  useGLTF,
  Html,
} from "@react-three/drei";
import AnimatedModel from "./AnimatedModel";
import Loader3D from "./Loader3D";
import useLang from "../context/useLang";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade } from "swiper/modules";
import gsap from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "../styles/hero.css";

const BASE_URL = "https://pub-67bbafe0d17b47029e176cdfe1e3b7a9.r2.dev/cars";

const cars = [
  {
    name: "Ferrari F40",
    model: `${BASE_URL}/ferrari_f40.glb`,
    scale: 1,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "V8 biturbo", displacement: "2936 cc", price: "—" },
    specs: {
      year: 1991,
      power_hp: 478,
      torque_nm: 577,
      drivetrain: "RWD",
      transmission: "5MT",
      weight_kg: 1100,
      zeroTo100_s: 4.1,
      topSpeed_kmh: 324,
      length_mm: 4430,
      width_mm: 1980,
      height_mm: 1120,
      wheelbase_mm: 2450,
    },
  },
  {
    name: "BMW M3 E30",
    model: `${BASE_URL}/bmw_m3.glb`,
    scale: 1,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "S14 I4", displacement: "2302 cc", price: "—" },
    specs: {
      year: 1990,
      power_hp: 200,
      torque_nm: 240,
      drivetrain: "RWD",
      transmission: "5MT",
      weight_kg: 1200,
      zeroTo100_s: 6.7,
      topSpeed_kmh: 235,
      length_mm: 4345,
      width_mm: 1680,
      height_mm: 1370,
      wheelbase_mm: 2565,
    },
  },
  {
    name: "Dodge Charger (1969)",
    model: `${BASE_URL}/dodge_charger.glb`,
    scale: 0.9,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "426 HEMI V8", displacement: "6997 cc", price: "—" },
    specs: {
      year: 1969,
      power_hp: 425,
      torque_nm: 664,
      drivetrain: "RWD",
      transmission: "4MT",
      weight_kg: 1700,
      zeroTo100_s: 5.5,
      topSpeed_kmh: 220,
      length_mm: 5280,
      width_mm: 1940,
      height_mm: 1360,
      wheelbase_mm: 2970,
    },
  },
  {
    name: "Nissan Skyline GT-R (R33)",
    model: `${BASE_URL}/nissan_skyline_r33.glb`,
    scale: 0.3,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "RB26DETT", displacement: "2568 cc", price: "—" },
    specs: {
      year: 1995,
      power_hp: 280,
      torque_nm: 368,
      drivetrain: "AWD",
      transmission: "5MT",
      weight_kg: 1540,
      zeroTo100_s: 5.4,
      topSpeed_kmh: 250,
      length_mm: 4675,
      width_mm: 1780,
      height_mm: 1360,
      wheelbase_mm: 2720,
    },
  },
  {
    name: "Nissan Skyline GT-R (R34)",
    model: `${BASE_URL}/nissan_skyline_r34.glb`,
    scale: 104,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "RB26DETT", displacement: "2568 cc", price: "—" },
    specs: {
      year: 1999,
      power_hp: 280,
      torque_nm: 392,
      drivetrain: "AWD",
      transmission: "6MT",
      weight_kg: 1560,
      zeroTo100_s: 4.9,
      topSpeed_kmh: 250,
      length_mm: 4600,
      width_mm: 1785,
      height_mm: 1360,
      wheelbase_mm: 2665,
    },
  },
  {
    name: "Audi TT RS (8S)",
    model: `${BASE_URL}/audi_tt_rs.glb`,
    scale: 105,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: { engine: "2.5 TFSI", displacement: "2480 cc", price: "—" },
    specs: {
      year: 2017,
      power_hp: 400,
      torque_nm: 480,
      drivetrain: "AWD",
      transmission: "7DCT",
      weight_kg: 1450,
      zeroTo100_s: 3.7,
      topSpeed_kmh: 250,
      length_mm: 4191,
      width_mm: 1832,
      height_mm: 1343,
      wheelbase_mm: 2505,
    },
  },
];

cars.forEach((c) => useGLTF.preload(c.model));

export default function Hero() {
  const { t } = useLang();
  const [active, setActive] = useState(0);
  const statsRef = useRef(null);

  const cameraPosition = useMemo(
    () => (window.innerWidth <= 768 ? [0, 1, 7] : [0, 1.5, 5]),
    []
  );

  useEffect(() => {
    const next = cars[active + 1];
    const prev = cars[active - 1];
    if (next) useGLTF.preload(next.model);
    if (prev) useGLTF.preload(prev.model);
  }, [active]);

  useEffect(() => {
    if (!statsRef.current) return;
    gsap.fromTo(
      statsRef.current.querySelectorAll("p, h2, h3"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [active]);

  const s = cars[active].specs;

  const statPairs = [
    [t.car.engine, cars[active].stats.engine],
    [t.car.displacement, cars[active].stats.displacement],
    [t.car.year, s.year],
    [t.car.power, `${s.power_hp} hp`],
    [t.car.torque, `${s.torque_nm} Nm`],
    [t.car.drivetrain, s.drivetrain],
    [t.car.transmission, s.transmission],
    [t.car.weight, `${s.weight_kg} kg`],
    [t.car.zeroTo100, `${s.zeroTo100_s}s`],
    [t.car.wheelbase, `${s.wheelbase_mm} mm`],
    { label: t.car.topSpeed, value: `${s.topSpeed_kmh} km/h`, fullWidth: true },
    {
      label: t.car.dimensions,
      value: `${s.length_mm} × ${s.width_mm} × ${s.height_mm} mm`,
      fullWidth: true,
    },
    { label: t.car.price, value: cars[active].stats.price, fullWidth: true },
  ];

  return (
    <>
      <section className="hero container">
        <Swiper
          modules={[Navigation, EffectFade]}
          navigation
          effect="fade"
          onSlideChange={(sw) => setActive(sw.activeIndex)}
          className="swiper"
        >
          {cars.map((car) => (
            <SwiperSlide key={car.model} />
          ))}
        </Swiper>

        <div className="row">
          <div className="col-md-7">
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
                    key={cars[active].model}
                    modelPath={cars[active].model}
                    scaleFactor={cars[active].scale}
                    rotation={cars[active].rotation}
                    offset={cars[active].offset}
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

                <OrbitControls
                  makeDefault
                  enableZoom={false}
                  enablePan={false}
                />
                <Environment preset="sunset" />
              </Canvas>
            </div>
          </div>

          <div className="col-md-5">
            <h2 className="text-center text-color">{cars[active].name}</h2>
            <div className="car-stats" ref={statsRef}>
              <div className="tech-sheet">
                <h3>{t.car.tech_sheet}</h3>
                {(() => {
                  const rows = [];
                  let tempRow = [];
                  statPairs.forEach((stat) => {
                    if (stat.fullWidth) {
                      if (tempRow.length > 0) {
                        rows.push(tempRow);
                        tempRow = [];
                      }
                      rows.push([stat]);
                    } else {
                      tempRow.push({ label: stat[0], value: stat[1] });
                      if (tempRow.length === 2) {
                        rows.push(tempRow);
                        tempRow = [];
                      }
                    }
                  });
                  if (tempRow.length > 0) rows.push(tempRow);

                  return rows.map((row, i) => (
                    <div className="row" key={i}>
                      {row.map((stat, j) => (
                        <div
                          className={stat.fullWidth ? "col-12" : "col-md-6"}
                          key={j}
                        >
                          <p>
                            {stat.label}: {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
