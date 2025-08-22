import { useState, useMemo, useCallback } from "react";
import useLang from "../../context/useLang";
import { cars } from "./carsData";
import BlurText from "../BlurText";
import CountUp from "../CountUp";
import CarCanvas from "./CarCanvas";
import HeroStats from "./HeroStats";
import HeroCarousel from "./HeroCarousel";
import useFxRates from "./useFxRates";
import {
  nf0,
  nf1,
  asWeight,
  asLengthMm,
  asDimensions,
  KMH_TO_MPH,
} from "./formatters";

import "../../styles/hero.css";

export default function Hero() {
  const { t, lang } = useLang();
  const [active, setActive] = useState(0);
  const carKeys = Object.keys(cars);
  const activeCar = cars[carKeys[active]];
  const s = activeCar.specs;

  const rates = useFxRates();

  const cameraPosition = useMemo(
    () => (window.innerWidth <= 768 ? [0, 1.5, 5.5] : [0, 1.5, 5]),
    []
  );

  const handleSlideChange = useCallback((index) => {
    setActive(index);
  }, []);

  const powerValue = useMemo(() => {
    const hp = s.power_hp;
    if (lang === "it") {
      const cv = Math.round(hp * 1.014);
      return `${nf0("it").format(cv)} CV`;
    }
    return `${nf0("en").format(hp)} hp`;
  }, [lang, s]);

  const priceLabel = useMemo(() => {
    const eur = activeCar.stats.price_eur ?? null;
    if (!eur) return "—";

    if (lang === "en") {
      const gbpRate = rates?.rates?.GBP ?? null;
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
  }, [lang, rates, activeCar]);

  const statPairs = useMemo(() => {
    return [
      { label: t.car.engine, value: activeCar.stats.engine },
      { label: t.car.displacement, value: activeCar.stats.displacement },
      { label: t.car.year, value: String(s.year) },
      { label: t.car.power, value: powerValue },
      { label: t.car.drivetrain, value: s.drivetrain },
      { label: t.car.transmission, value: s.transmission },
      { label: t.car.weight, value: asWeight(s.weight_kg, lang) },
      { label: t.car.zeroTo100, value: `${nf1(lang).format(s.zeroTo100_s)}s` },
      { label: t.car.wheelbase, value: asLengthMm(s.wheelbase_mm, lang) },
      {
        label: t.car.topSpeed,
        value: (
          <span key={active} className="count-up-text">
            <CountUp
              from={0}
              to={
                lang === "en"
                  ? Math.round(s.topSpeed_kmh * KMH_TO_MPH)
                  : s.topSpeed_kmh
              }
              separator=","
              direction="up"
              duration={1.5}
            />
            {lang === "en" ? " mph" : " km/h"}
          </span>
        ),
      },
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
  }, [active, lang, s, t, powerValue, priceLabel, activeCar]);

  return (
    <section className="hero container">
      <h1>
        <BlurText
          key={active}
          text={activeCar.name}
          delay={50}
          animateBy="letters"
          direction="top"
          className="text-color title-car"
        />
      </h1>
      <HeroCarousel
        cars={carKeys.map((key) => cars[key])}
        onSlideChange={handleSlideChange}
      />
      <div className="row">
        <div className="col-md-7">
          <CarCanvas
            car={activeCar}
            cars={cars}
            active={active}
            cameraPosition={cameraPosition}
          />
        </div>
        <div className="col-md-5">
          <HeroStats statPairs={statPairs} t={t} active={active} />
        </div>
      </div>
    </section>
  );
}
