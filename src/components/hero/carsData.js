const BASE_URL = import.meta.env.VITE_CARS_BASE_URL;

const FLAG_ITALY = { top: "#009246", middle: "#FFFFFF", bottom: "#CE2B37" };
const FLAG_GERMANY = { top: "#000000", middle: "#DD0000", bottom: "#FFCE00" };
const FLAG_JAPAN = { top: "#BC002D", middle: null, bottom: "#FFFFFF" };
const FLAG_USA = { top: "#B22234", middle: "#FFFFFF", bottom: "#3C3B6E" };

export const cars = {
  f40: {
    id: "f40",
    pillarColors: FLAG_ITALY,
    name: "Ferrari F40",
    model: `${BASE_URL}/ferrari_f40_draco.glb`,
    scale: 1,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "V8 biturbo",
      displacement: "2936 cc",
      price_eur: 1200000,
    },
    specs: {
      year: 1987,
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
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-2.742, 0.229, 2.475],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.789, -0.056, 1.139],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.198, 0.588, -0.171],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.659, -0.2, 3.621],
          target: [-0.481, -0.175, 2.434],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-1.148, 0.51, 0.951],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },
  lancia_delta_integrale: {
    id: "lancia_delta_integrale",
    pillarColors: FLAG_ITALY,
    name: "Lancia Delta HF",
    model: `${BASE_URL}/lancia_delta_draco.glb`,
    scale: 110,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "2.0L Turbo I4",
      displacement: "1995 cc",
      price_eur: 90000,
    },
    specs: {
      year: 1992,
      power_hp: 215,
      torque_nm: 298,
      drivetrain: "AWD",
      transmission: "5MT",
      weight_kg: 1340,
      zeroTo100_s: 5.7,
      topSpeed_kmh: 220,
      length_mm: 3890,
      width_mm: 1770,
      height_mm: 1365,
      wheelbase_mm: 2475,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.631, 0.239, 1.838],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.789, -0.056, 1.139],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.049, 0.429, 1.778],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.7, -0.201, 3.435],
          target: [-0.96, -0.204, 2.263],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.634, 0.595, 0.617],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  bmw_m2_g87: {
    id: "bmw_m2_g87",
    pillarColors: FLAG_GERMANY,
    name: "BMW M2 (G87)",
    model: `${BASE_URL}/bmw_m2_draco.glb`,
    scale: 110,
    rotation: [0, -0.5, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "3.0L Twin-Turbo Inline-6 (S58)",
      displacement: "2993 cc",
      price_eur: 77000,
    },
    specs: {
      year: 2023,
      power_hp: 460,
      torque_nm: 550,
      drivetrain: "RWD",
      transmission: "6MT / 8AT",
      weight_kg: 1725,
      zeroTo100_s: 4.1,
      topSpeed_kmh: 285,
      length_mm: 4580,
      width_mm: 1887,
      height_mm: 1403,
      wheelbase_mm: 2747,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.776, 0.226, 1.528],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.789, -0.056, 1.139],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.049, 0.429, 1.778],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.659, -0.2, 3.621],
          target: [-0.481, -0.175, 2.434],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.352, 0.73, 0.535],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  honda_s2000: {
    id: "honda_s2000",
    pillarColors: FLAG_JAPAN,
    name: "Honda S2000",
    model: `${BASE_URL}/honda_s2000_draco.glb`,
    scale: 110,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "2.0L DOHC VTEC Inline-4 (F20C)",
      displacement: "1997 cc",
      price_eur: 35000,
    },
    specs: {
      year: 1999,
      power_hp: 240,
      torque_nm: 208,
      drivetrain: "RWD",
      transmission: "6MT",
      weight_kg: 1250,
      zeroTo100_s: 6.2,
      topSpeed_kmh: 240,
      length_mm: 4135,
      width_mm: 1750,
      height_mm: 1285,
      wheelbase_mm: 2400,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.647, 0.166, 1.777],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.884, -0.018, 1.369],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.326, 0.374, 1.77],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.711, -0.221, 3.277],
          target: [-0.889, -0.294, 2.093],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.747, 0.588, 0.541],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  honda_nsx: {
    id: "honda_nsx",
    pillarColors: FLAG_JAPAN,
    name: "Honda NSX",
    model: `${BASE_URL}/honda_nsx_draco.glb`,
    scale: 110,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "3.0L DOHC VTEC V6 (C30A)",
      displacement: "2977 cc",
      price_eur: 90000,
    },
    specs: {
      year: 1990,
      power_hp: 270,
      torque_nm: 285,
      drivetrain: "RWD",
      transmission: "5MT",
      weight_kg: 1365,
      zeroTo100_s: 5.9,
      topSpeed_kmh: 270,
      length_mm: 4405,
      width_mm: 1810,
      height_mm: 1170,
      wheelbase_mm: 2530,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.698, 0.221, 1.685],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.884, -0.018, 1.369],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        rotation: [0, Math.PI + 0.2, 0],
        hotspot3D: [-0.622, 0.434, -0.863],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.711, -0.221, 3.277],
          target: [-0.889, -0.294, 2.093],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.747, 0.588, 0.541],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  fxxk: {
    id: "fxxk",
    pillarColors: FLAG_ITALY,
    name: "Ferrari FXX K",
    model: `${BASE_URL}/ferrari_fxx_k_2015_draco.glb`,
    scale: 40,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "V12 6.3L + KERS",
      displacement: "6262 cc",
      price_eur: 2500000,
    },
    specs: {
      year: 2015,
      power_hp: 1050,
      torque_nm: 900,
      drivetrain: "RWD",
      transmission: "7-DCT",
      weight_kg: 1165,
      zeroTo100_s: 2.7,
      topSpeed_kmh: 350,
      length_mm: 4896,
      width_mm: 2051,
      height_mm: 1116,
      wheelbase_mm: 2650,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.698, 0.221, 1.685],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.593, -0.039, 0.892],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        rotation: [0, Math.PI + 0.2, 0],
        hotspot3D: [-0.622, 0.434, -0.863],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.7, -0.201, 3.437],
          target: [-0.971, -0.204, 2.268],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.747, 0.588, 0.541],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },
  zonda_cinque: {
    id: "zonda_cinque",
    pillarColors: FLAG_ITALY,
    name: "Pagani Zonda Cinque",
    model: `${BASE_URL}/pagani_zonda_cinque_draco.glb`,
    scale: 1.1,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "V12 AMG 6.0L",
      displacement: "5987 cc",
      price_eur: 1300000,
    },
    specs: {
      year: 2009,
      power_hp: 678,
      torque_nm: 780,
      drivetrain: "RWD",
      transmission: "6-seq",
      weight_kg: 1210,
      zeroTo100_s: 3.4,
      topSpeed_kmh: 350,
      length_mm: 4436,
      width_mm: 2014,
      height_mm: 1141,
      wheelbase_mm: 2730,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.698, 0.221, 1.685],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.593, -0.039, 0.892],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        rotation: [0, Math.PI + 0.2, 0],
        hotspot3D: [-0.622, 0.434, -0.863],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.659, 0.8, 3.621],
          target: [-0.481, 0, 2.434],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.747, 0.588, 0.541],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  porsche_911_turbo_1975: {
    id: "porsche_911_turbo_1975",
    pillarColors: FLAG_GERMANY,
    name: "Porsche 911 Turbo (1975)",
    model: `${BASE_URL}/porsche_911_turbo_1975_draco.glb`,
    scale: 1.5,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "Flat-6 Turbo 3.0L",
      displacement: "2994 cc",
      price_eur: 150000,
    },
    specs: {
      year: 1975,
      power_hp: 260,
      torque_nm: 343,
      drivetrain: "RWD",
      transmission: "4-manual",
      weight_kg: 1200,
      zeroTo100_s: 5.5,
      topSpeed_kmh: 250,
      length_mm: 4291,
      width_mm: 1775,
      height_mm: 1310,
      wheelbase_mm: 2271,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.575, 0.303, 1.706],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.877, -0.027, 1.331],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        rotation: [0, Math.PI + 0.2, 0],
        hotspot3D: [-0.622, 0.434, -0.863],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.7, -0.201, 3.437],
          target: [-0.971, -0.204, 2.268],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.421, 0.727, 0.5],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  f12: {
    id: "f12",
    pillarColors: FLAG_ITALY,
    name: "Ferrari F12 berlinetta",
    model: `${BASE_URL}/ferrari_f12_berlinetta_draco.glb`,
    scale: 100,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "V12 aspirato 6.3L",
      displacement: "6262 cc",
      price_eur: 270000,
    },
    specs: {
      year: 2012,
      power_hp: 740,
      torque_nm: 690,
      drivetrain: "RWD",
      transmission: "7DCT",
      weight_kg: 1525,
      zeroTo100_s: 3.1,
      topSpeed_kmh: 340,
      length_mm: 4618,
      width_mm: 1942,
      height_mm: 1273,
      wheelbase_mm: 2720,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.647, 0.166, 1.777],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.816, -0.017, 1.189],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.326, 0.374, 1.77],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.704, -0.192, 3.436],
          target: [-0.99, -0.145, 2.271],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.747, 0.588, 0.541],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  f488: {
    id: "f488",
    pillarColors: FLAG_ITALY,
    name: "Ferrari 488 Pista",
    model: `${BASE_URL}/ferrari_488_pista_draco.glb`,
    scale: 65,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "V8 biturbo 3.9L",
      displacement: "3902 cc",
      price_eur: 300000,
    },
    specs: {
      year: 2018,
      power_hp: 720,
      torque_nm: 770,
      drivetrain: "RWD",
      transmission: "7DCT",
      weight_kg: 1385,
      zeroTo100_s: 2.85,
      topSpeed_kmh: 340,
      length_mm: 4605,
      width_mm: 1975,
      height_mm: 1206,
      wheelbase_mm: 2650,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.709, 0.135, 1.693],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.573, -0.1, 0.923],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        rotation: [0, Math.PI + 0.2, 0],
        hotspot3D: [-0.622, 0.434, -0.863],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.659, -0.2, 3.621],
          target: [-0.481, -0.175, 2.434],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-1.185, 0.502, 1.014],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  m3_e30: {
    id: "m3_e30",
    pillarColors: FLAG_GERMANY,
    name: "BMW M3 E30",
    model: `${BASE_URL}/bmw_m3_draco.glb`,
    scale: 1,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
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
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.577, 0.166, 1.926],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.9, -0.025, 1.543],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.55, 0.01, 1.162],
          target: [-0.384, -0.131, 1.407],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.326, 0.374, 1.77],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.691, -0.039, -0.946],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.715, -0.216, 3.277],
          target: [-0.907, -0.269, 2.094],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.534, 0.604, 0.729],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  charger69: {
    id: "charger69",
    pillarColors: FLAG_USA,
    name: "Dodge Charger",
    model: `${BASE_URL}/dodge_charger_draco.glb`,
    scale: 0.9,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
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
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.439, 0.108, 2.034],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.904, -0.104, 1.498],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.326, 0.374, 1.77],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.572, 0.111, -1.402],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.659, -0.2, 3.621],
          target: [-0.481, -0.175, 2.434],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.896, 0.54, 0.876],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  supra_mk4: {
    id: "supra_mk4",
    pillarColors: FLAG_JAPAN,
    name: "Toyota Supra MK4",
    model: `${BASE_URL}/toyota_supra_draco.glb`,
    scale: 0.3,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "2JZ 3.0L biturbo",
      displacement: "2997 cc",
      price_eur: 40000,
    },
    specs: {
      year: 1993,
      power_hp: 280,
      torque_nm: 440,
      drivetrain: "RWD",
      transmission: "6MT",
      weight_kg: 1510,
      zeroTo100_s: 4.9,
      topSpeed_kmh: 250,
      length_mm: 4520,
      width_mm: 1810,
      height_mm: 1275,
      wheelbase_mm: 2550,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.635, 0.155, 1.82],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.857, -0.058, 1.266],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.326, 0.374, 1.77],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.685, 0.116, -0.926],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.683, -0.205, 3.428],
          target: [-0.833, -0.234, 2.238],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.896, 0.54, 0.876],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  skyline_r33: {
    id: "skyline_r33",
    pillarColors: FLAG_JAPAN,
    name: "Nissan Skyline GT-R (R33)",
    model: `${BASE_URL}/nissan_skyline_r33_draco.glb`,
    scale: 0.3,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
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
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.635, 0.155, 1.82],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.885, -0.039, 1.375],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.326, 0.374, 1.77],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.685, 0.116, -0.926],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.661, -0.2, 3.524],
          target: [-0.687, -0.204, 2.324],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.896, 0.54, 0.876],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  skyline_r34: {
    id: "skyline_r34",
    pillarColors: FLAG_JAPAN,
    name: "Nissan Skyline GT-R (R34)",
    model: `${BASE_URL}/nissan_skyline_r34_draco.glb`,
    scale: 104,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
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
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.55, 0.275, 1.841],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.869, 0.06, 1.325],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-0.992, 0.462, 1.694],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.508, 0.273, -1.603],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.671, -0.194, 3.528],
          target: [-0.825, -0.12, 2.34],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.416, 0.727, 0.503],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  z350: {
    id: "z350",
    pillarColors: FLAG_JAPAN,
    name: "Nissan 350Z",
    model: `${BASE_URL}/nissan_350z_draco.glb`,
    scale: 104,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: { engine: "VQ35DE V6", displacement: "3498 cc", price_eur: 20000 },
    specs: {
      year: 2003,
      power_hp: 276,
      torque_nm: 363,
      drivetrain: "RWD",
      transmission: "6MT",
      weight_kg: 1530,
      zeroTo100_s: 5.8,
      topSpeed_kmh: 250,
      length_mm: 4315,
      width_mm: 1815,
      height_mm: 1315,
      wheelbase_mm: 2650,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.657, 0.298, 1.588],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.869, 0.06, 1.325],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-0.992, 0.462, 1.694],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.508, 0.273, -1.603],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.686, -0.204, 3.38],
          target: [-0.819, -0.224, 2.188],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.6, 0.623, 0.585],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  rx7_fd: {
    id: "rx7_fd",
    pillarColors: FLAG_JAPAN,
    name: "Mazda RX-7",
    model: `${BASE_URL}/mazda_rx-7_draco.glb`,
    scale: 0.4,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "twin-turbo rotary",
      displacement: "1308 cc",
      price_eur: 25000,
    },
    specs: {
      year: 1993,
      power_hp: 255,
      torque_nm: 295,
      drivetrain: "RWD",
      transmission: "5MT",
      weight_kg: 1265,
      zeroTo100_s: 5.0,
      topSpeed_kmh: 252,
      length_mm: 4295,
      width_mm: 1750,
      height_mm: 1230,
      wheelbase_mm: 2425,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.672, 0.18, 1.704],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.869, 0.06, 1.325],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.312, 0.351, 1.85],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.508, 0.273, -1.603],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.684, -0.196, 3.497],
          target: [-0.922, -0.155, 2.321],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.6, 0.623, 0.585],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },

  tt_rs: {
    id: "tt_rs",
    pillarColors: FLAG_GERMANY,
    name: "Audi TT RS",
    model: `${BASE_URL}/audi_tt_rs_draco.glb`,
    scale: 1,
    rotation: [0, -0.4, 0],
    offset: [0, -0.5, 0],
    stats: {
      engine: "2.5 L TFSI turbo I-5",
      displacement: "2480 cc",
      price_eur: 73000,
    },
    specs: {
      year: 2017,
      power_hp: 400,
      torque_nm: 480,
      drivetrain: "AWD",
      transmission: "7DCT",
      weight_kg: 1450,
      zeroTo100_s: 3.7,
      topSpeed_kmh: 280,
      length_mm: 4191,
      width_mm: 1832,
      height_mm: 1343,
      wheelbase_mm: 2505,
    },
    experience: [
      {
        key: "headlights",
        type: "focus",
        hotspot3D: [-1.711, 0.233, 1.652],
        camera: {
          pos: [-2.508, 0.086, 2.73],
          target: [-1.645, 0.12, 1.898],
        },
      },
      {
        key: "brake",
        type: "focus",
        hotspot3D: [-1.805, -0.052, 1.163],
        rotation: [0, 1, 0],
        camera: {
          pos: [-1.456, -0.021, 1.771],
          target: [-0.285, -0.14, 1.54],
        },
      },
      {
        key: "engine",
        type: "focus",
        hotspot3D: [-1.167, 0.372, 1.887],
        camera: {
          pos: [-0.579, 1.579, 3.15],
          target: [-0.401, 0.779, 2.126],
        },
      },

      {
        key: "exhaust",
        type: "focus",
        hotspot3D: [-0.601, 0.29, -1.184],
        rotation: [0, Math.PI + 0.2, 0],
        camera: {
          pos: [-0.683, -0.203, 3.43],
          target: [-0.833, -0.225, 2.24],
        },
      },
      {
        key: "interior",
        type: "focus",
        hotspot3D: [-0.6, 0.623, 0.585],
        rotation: [0, 0, 0],
        camera: {
          pos: [-2.044, 1, 1.699],
          target: [-1.09, 0.8, 0.998],
        },
      },
    ],
  },
};
