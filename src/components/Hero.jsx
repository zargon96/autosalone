// import { useRef, useState, useEffect, Suspense, useMemo } from "react";
// import { Canvas } from "@react-three/fiber";
// import {
//   OrbitControls,
//   Environment,
//   ContactShadows,
//   useGLTF,
//   Html,
// } from "@react-three/drei";
// import AnimatedModel from "./AnimatedModel";
// import Loader3D from "./Loader3D";
// import useLang from "../context/useLang";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, EffectFade } from "swiper/modules";
// import gsap from "gsap";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/effect-fade";
// import "../styles/hero.css";

// const BASE_URL = "https://pub-67bbafe0d17b47029e176cdfe1e3b7a9.r2.dev/cars";

// const cars = [
//   {
//     name: "Ferrari F40",
//     model: `${BASE_URL}/ferrari_f40.glb`,
//     scale: 1,
//     rotation: [0, -0.4, 0],
//     offset: [0, 0, 0],
//     stats: { engine: "V8 biturbo", displacement: "2936 cc", price: "—" },
//     specs: {
//       year: 1991,
//       power_hp: 478,
//       torque_nm: 577,
//       drivetrain: "RWD",
//       transmission: "5MT",
//       weight_kg: 1100,
//       zeroTo100_s: 4.1,
//       topSpeed_kmh: 324,
//       length_mm: 4430,
//       width_mm: 1980,
//       height_mm: 1120,
//       wheelbase_mm: 2450,
//     },
//   },
//   {
//     name: "BMW M3 E30",
//     model: `${BASE_URL}/bmw_m3.glb`,
//     scale: 1,
//     rotation: [0, -0.4, 0],
//     offset: [0, 0, 0],
//     stats: { engine: "S14 I4", displacement: "2302 cc", price: "—" },
//     specs: {
//       year: 1990,
//       power_hp: 200,
//       torque_nm: 240,
//       drivetrain: "RWD",
//       transmission: "5MT",
//       weight_kg: 1200,
//       zeroTo100_s: 6.7,
//       topSpeed_kmh: 235,
//       length_mm: 4345,
//       width_mm: 1680,
//       height_mm: 1370,
//       wheelbase_mm: 2565,
//     },
//   },
//   {
//     name: "Dodge Charger (1969)",
//     model: `${BASE_URL}/dodge_charger.glb`,
//     scale: 0.9,
//     rotation: [0, -0.4, 0],
//     offset: [0, 0, 0],
//     stats: { engine: "426 HEMI V8", displacement: "6997 cc", price: "—" },
//     specs: {
//       year: 1969,
//       power_hp: 425,
//       torque_nm: 664,
//       drivetrain: "RWD",
//       transmission: "4MT",
//       weight_kg: 1700,
//       zeroTo100_s: 5.5,
//       topSpeed_kmh: 220,
//       length_mm: 5280,
//       width_mm: 1940,
//       height_mm: 1360,
//       wheelbase_mm: 2970,
//     },
//   },
//   {
//     name: "Nissan Skyline GT-R (R33)",
//     model: `${BASE_URL}/nissan_skyline_r33.glb`,
//     scale: 0.3,
//     rotation: [0, -0.4, 0],
//     offset: [0, 0, 0],
//     stats: { engine: "RB26DETT", displacement: "2568 cc", price: "—" },
//     specs: {
//       year: 1995,
//       power_hp: 280,
//       torque_nm: 368,
//       drivetrain: "AWD",
//       transmission: "5MT",
//       weight_kg: 1540,
//       zeroTo100_s: 5.4,
//       topSpeed_kmh: 250,
//       length_mm: 4675,
//       width_mm: 1780,
//       height_mm: 1360,
//       wheelbase_mm: 2720,
//     },
//   },
//   {
//     name: "Nissan Skyline GT-R (R34)",
//     model: `${BASE_URL}/nissan_skyline_r34.glb`,
//     scale: 104,
//     rotation: [0, -0.4, 0],
//     offset: [0, 0, 0],
//     stats: { engine: "RB26DETT", displacement: "2568 cc", price: "—" },
//     specs: {
//       year: 1999,
//       power_hp: 280,
//       torque_nm: 392,
//       drivetrain: "AWD",
//       transmission: "6MT",
//       weight_kg: 1560,
//       zeroTo100_s: 4.9,
//       topSpeed_kmh: 250,
//       length_mm: 4600,
//       width_mm: 1785,
//       height_mm: 1360,
//       wheelbase_mm: 2665,
//     },
//   },
//   {
//     name: "Audi TT RS (8S)",
//     model: `${BASE_URL}/audi_tt_rs.glb`,
//     scale: 105,
//     rotation: [0, -0.4, 0],
//     offset: [0, 0, 0],
//     stats: { engine: "2.5 TFSI", displacement: "2480 cc", price: "—" },
//     specs: {
//       year: 2017,
//       power_hp: 400,
//       torque_nm: 480,
//       drivetrain: "AWD",
//       transmission: "7DCT",
//       weight_kg: 1450,
//       zeroTo100_s: 3.7,
//       topSpeed_kmh: 250,
//       length_mm: 4191,
//       width_mm: 1832,
//       height_mm: 1343,
//       wheelbase_mm: 2505,
//     },
//   },
// ];

// cars.forEach((c) => useGLTF.preload(c.model));

// export default function Hero() {
//   const { t } = useLang();
//   const [active, setActive] = useState(0);
//   const statsRef = useRef(null);

//   const cameraPosition = useMemo(
//     () => (window.innerWidth <= 768 ? [0, 1, 7] : [0, 1.5, 5]),
//     []
//   );

//   useEffect(() => {
//     const next = cars[active + 1];
//     const prev = cars[active - 1];
//     if (next) useGLTF.preload(next.model);
//     if (prev) useGLTF.preload(prev.model);
//   }, [active]);

//   useEffect(() => {
//     if (!statsRef.current) return;
//     gsap.fromTo(
//       statsRef.current.querySelectorAll("p, h1, h2"),
//       { y: 40, opacity: 0 },
//       { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
//     );
//   }, [active]);

//   const KG_TO_LB = 2.2046226218;
//   const KMH_TO_MPH = 0.6213711922;
//   const MM_TO_IN = 1 / 25.4;

//   const nf = (lang) =>
//     new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
//   const nf1 = (lang) =>
//     new Intl.NumberFormat(lang, { maximumFractionDigits: 1 });

//   function asWeight(kg, lang) {
//     if (lang === "en")
//       return `${nf(lang).format(Math.round(kg * KG_TO_LB))} lb`;
//     return `${nf(lang).format(kg)} kg`;
//   }

//   function asSpeed(kmh, lang) {
//     if (lang === "en")
//       return `${nf(lang).format(Math.round(kmh * KMH_TO_MPH))} mph`;
//     return `${nf(lang).format(kmh)} km/h`;
//   }

//   function asLengthMm(mm, lang) {
//     if (lang === "en")
//       return `${nf(lang).format(Math.round(mm * MM_TO_IN))} in`;
//     return `${nf(lang).format(mm)} mm`;
//   }

//   function asDimensions({ length_mm, width_mm, height_mm }, lang) {
//     if (lang === "en") {
//       const L = Math.round(length_mm * MM_TO_IN);
//       const W = Math.round(width_mm * MM_TO_IN);
//       const H = Math.round(height_mm * MM_TO_IN);
//       return `${nf(lang).format(L)} × ${nf(lang).format(W)} × ${nf(lang).format(
//         H
//       )} in`;
//     }
//     return `${nf(lang).format(length_mm)} × ${nf(lang).format(width_mm)} × ${nf(
//       lang
//     ).format(height_mm)} mm`;
//   }

//   // Potenza: hp in EN, CV in IT (1 hp ≈ 1.014 CV)
//   function asPower(hp, lang) {
//     if (lang === "it") {
//       const cv = Math.round(hp * 1.014);
//       return `${nf("it").format(cv)} CV`;
//     }
//     return `${nf("en").format(hp)} hp`;
//   }

//   const { lang } = useLang();
//   const s = cars[active].specs;

//   // valore potenza come prima, usando helper
//   const powerValue = asPower(s.power_hp, lang);

//   const statPairs = [
//     [t.car.engine, cars[active].stats.engine],
//     [t.car.displacement, cars[active].stats.displacement],
//     [t.car.year, nf(lang).format(s.year)],
//     [t.car.power, powerValue],
//     [t.car.drivetrain, s.drivetrain],
//     [t.car.transmission, s.transmission],
//     [t.car.weight, asWeight(s.weight_kg, lang)],
//     [t.car.zeroTo100, `${nf1(lang).format(s.zeroTo100_s)}s`],
//     [t.car.wheelbase, asLengthMm(s.wheelbase_mm, lang)],
//     [t.car.topSpeed, asSpeed(s.topSpeed_kmh, lang)],
//     {
//       label: t.car.dimensions,
//       value: asDimensions(
//         {
//           length_mm: s.length_mm,
//           width_mm: s.width_mm,
//           height_mm: s.height_mm,
//         },
//         lang
//       ),
//       fullWidth: true,
//     },
//     { label: t.car.price, value: cars[active].stats.price, fullWidth: true },
//   ];

//   return (
//     <>
//       <section className="hero container">
//         <h1 className="text-color title-car">{cars[active].name}</h1>
//         <Swiper
//           modules={[Navigation, EffectFade]}
//           navigation
//           effect="fade"
//           onSlideChange={(sw) => setActive(sw.activeIndex)}
//           className="swiper"
//         >
//           {cars.map((car) => (
//             <SwiperSlide key={car.model} />
//           ))}
//         </Swiper>

//         <div className="row">
//           <div className="col-md-7">
//             <div className="model-view">
//               <Canvas
//                 shadows
//                 dpr={[1, 1.75]}
//                 gl={{ powerPreference: "high-performance", antialias: true }}
//                 camera={{ position: cameraPosition, fov: 45 }}
//               >
//                 <ambientLight intensity={0.8} />
//                 <directionalLight position={[5, 5, 5]} />

//                 <Suspense
//                   fallback={
//                     <Html center>
//                       <Loader3D />
//                     </Html>
//                   }
//                 >
//                   <AnimatedModel
//                     key={cars[active].model}
//                     modelPath={cars[active].model}
//                     scaleFactor={cars[active].scale}
//                     rotation={cars[active].rotation}
//                     offset={cars[active].offset}
//                     shadows={false}
//                     inDuration={0.8}
//                   />
//                 </Suspense>

//                 <ContactShadows
//                   position={[0, -0.01, 0]}
//                   opacity={0.5}
//                   blur={1.2}
//                   scale={10}
//                   far={5}
//                   resolution={512}
//                 />

//                 <OrbitControls
//                   makeDefault
//                   enableZoom={false}
//                   enablePan={false}
//                 />
//                 <Environment preset="sunset" />
//               </Canvas>
//             </div>
//           </div>
//           <div className="col-md-5">
//             <div className="car-stats" ref={statsRef}>
//               <div className="tech-sheet">
//                 <h2>{t.car.tech_sheet}</h2>
//                 {(() => {
//                   const rows = [];
//                   let tempRow = [];
//                   statPairs.forEach((stat) => {
//                     if (stat.fullWidth) {
//                       if (tempRow.length > 0) {
//                         rows.push(tempRow);
//                         tempRow = [];
//                       }
//                       rows.push([stat]);
//                     } else {
//                       tempRow.push({ label: stat[0], value: stat[1] });
//                       if (tempRow.length === 2) {
//                         rows.push(tempRow);
//                         tempRow = [];
//                       }
//                     }
//                   });
//                   if (tempRow.length > 0) rows.push(tempRow);

//                   return rows.map((row, i) => (
//                     <div className="row" key={i}>
//                       {row.map((stat, j) => (
//                         <div
//                           className={stat.fullWidth ? "col-12" : "col-md-6"}
//                           key={j}
//                         >
//                           <p>
//                             {stat.label}: {stat.value}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ));
//                 })()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }
import {
  useRef,
  useState,
  useEffect,
  Suspense,
  useMemo,
  useCallback,
} from "react";
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

const BASE_URL = import.meta.env.VITE_CARS_BASE_URL;

const cars = [
  {
    name: "Ferrari F40",
    model: `${BASE_URL}/ferrari_f40.glb`,
    scale: 1,
    rotation: [0, -0.4, 0],
    offset: [0, 0, 0],
    stats: {
      engine: "V8 biturbo",
      displacement: "2936 cc",
      price_eur: 1200000,
    },
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
    stats: { engine: "S14 I4", displacement: "2302 cc", price_eur: 55000 },
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
    stats: { engine: "426 HEMI V8", displacement: "6997 cc", price_eur: 40000 },
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
    stats: { engine: "RB26DETT", displacement: "2568 cc", price_eur: 80000 },
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
    stats: { engine: "RB26DETT", displacement: "2568 cc", price_eur: 120000 },
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
    stats: { engine: "2.5 TFSI", displacement: "2480 cc", price_eur: 73000 },
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
  const { t, lang } = useLang();
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
      statsRef.current.querySelectorAll("p, h1, h2"),
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [active]);

  const KG_TO_LB = 2.2046226218;
  const KMH_TO_MPH = 0.6213711922;
  const MM_TO_IN = 1 / 25.4;

  const nf0 = useCallback(
    (l) => new Intl.NumberFormat(l, { maximumFractionDigits: 0 }),
    []
  );
  const nf1 = (l) => new Intl.NumberFormat(l, { maximumFractionDigits: 1 });

  const asWeight = useCallback(
    (kg, l) => {
      if (l === "en") return `${nf0(l).format(Math.round(kg * KG_TO_LB))} lb`;
      return `${nf0(l).format(kg)} kg`;
    },
    [KG_TO_LB, nf0]
  );
  const asSpeed = useCallback(
    (kmh, l) => {
      if (l === "en")
        return `${nf0(l).format(Math.round(kmh * KMH_TO_MPH))} mph`;
      return `${nf0(l).format(kmh)} km/h`;
    },
    [KMH_TO_MPH, nf0]
  );
  const asLengthMm = useCallback(
    (mm, l) => {
      if (l === "en") return `${nf0(l).format(Math.round(mm * MM_TO_IN))} in`;
      return `${nf0(l).format(mm)} mm`;
    },
    [MM_TO_IN, nf0]
  );
  const asDimensions = useCallback(
    ({ length_mm, width_mm, height_mm }, l) => {
      if (l === "en") {
        const L = Math.round(length_mm * MM_TO_IN);
        const W = Math.round(width_mm * MM_TO_IN);
        const H = Math.round(height_mm * MM_TO_IN);
        return `${nf0(l).format(L)} × ${nf0(l).format(W)} × ${nf0(l).format(
          H
        )} in`;
      }
      return `${nf0(l).format(length_mm)} × ${nf0(l).format(width_mm)} × ${nf0(
        l
      ).format(height_mm)} mm`;
    },
    [MM_TO_IN, nf0]
  );

  const powerValue = useMemo(() => {
    const hp = cars[active].specs.power_hp;
    if (lang === "it") {
      const cv = Math.round(hp * 1.014);
      return `${nf0("it").format(cv)} CV`;
    }
    return `${nf0("en").format(hp)} hp`;
  }, [active, lang, nf0]);

  const [latestRates, setLatestRates] = useState(null);

  useEffect(() => {
    const cacheKey = import.meta.env.VITE_FX_CACHE_KEY;
    const apiBase = import.meta.env.VITE_FX_API_BASE;

    const url = `${apiBase}/latest?base=EUR&symbols=GBP`;

    (async () => {
      try {
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const obj = JSON.parse(cached);
          if (Date.now() - obj.ts < 60 * 60 * 1000) {
            setLatestRates(obj.data);
            return;
          }
        }
      } catch (err) {
        console.warn("[FX] Cache read/parse error:", err);
      }

      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLatestRates(data);

        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ ts: Date.now(), data })
          );
        } catch (err) {
          console.warn("[FX] Cache write error:", err);
        }
      } catch (err) {
        console.warn("[FX] Fetch failed, using stale cache if any:", err);
        try {
          const stale = localStorage.getItem(cacheKey);
          if (stale) {
            const obj = JSON.parse(stale);
            if (obj?.data) setLatestRates(obj.data);
          }
        } catch (err) {
          console.warn("[FX] Failed to load stale cache:", err);
        }
      }
    })();
  }, []);

  const priceLabel = useMemo(() => {
    const eur = cars[active].stats.price_eur ?? null;
    if (!eur) return "—";

    if (lang === "en") {
      const gbpRate = latestRates?.rates?.GBP ?? null;
      if (gbpRate) {
        const inGbp = eur * gbpRate;
        return new Intl.NumberFormat("en-GB", {
          style: "currency",
          currency: "GBP",
          maximumFractionDigits: 0,
        }).format(inGbp);
      }
      return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(eur);
    }
    return new Intl.NumberFormat("it-IT", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(eur);
  }, [active, lang, latestRates]);

  const s = cars[active].specs;

  const statPairs = useMemo(() => {
    return [
      [t.car.engine, cars[active].stats.engine],
      [t.car.displacement, cars[active].stats.displacement],
      [t.car.year, nf0(lang).format(s.year)],
      [t.car.power, powerValue],
      [t.car.drivetrain, s.drivetrain],
      [t.car.transmission, s.transmission],
      [t.car.weight, asWeight(s.weight_kg, lang)],
      [t.car.zeroTo100, `${nf1(lang).format(s.zeroTo100_s)}s`],
      [t.car.wheelbase, asLengthMm(s.wheelbase_mm, lang)],
      [t.car.topSpeed, asSpeed(s.topSpeed_kmh, lang)],
      {
        label: t.car.dimensions,
        value: asDimensions(
          {
            length_mm: s.length_mm,
            width_mm: s.width_mm,
            height_mm: s.height_mm,
          },
          lang
        ),
        fullWidth: true,
      },
      { label: t.car.price, value: priceLabel, fullWidth: true },
    ];
  }, [
    active,
    lang,
    powerValue,
    priceLabel,
    s,
    t,
    asWeight,
    asSpeed,
    asLengthMm,
    asDimensions,
    nf0,
  ]);

  return (
    <section className="hero container">
      <h1 className="text-color title-car">{cars[active].name}</h1>

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

              <OrbitControls makeDefault enableZoom={false} enablePan={false} />
              <Environment preset="sunset" />
            </Canvas>
          </div>
        </div>

        <div className="col-md-5">
          <div className="car-stats" ref={statsRef}>
            <div className="tech-sheet">
              <h2>{t.car.tech_sheet}</h2>

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
  );
}
