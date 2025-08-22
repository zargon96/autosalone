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
  const carKeys = Object.keys(cars);
  const [active, setActive] = useState(0);
  const car = cars[carKeys[active]];
  const s = car.specs;
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
    const eur = car.stats.price_eur ?? null;
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
  }, [car, lang, rates]);

  return (
    <section className="hero container">
      <h1>
        <BlurText
          key={active}
          text={car.name}
          delay={50}
          animateBy="letters"
          direction="top"
          className="text-color title-car"
        />
      </h1>

      <HeroCarousel
        cars={cars}
        carKeys={carKeys}
        onSlideChange={handleSlideChange}
      />

      <div className="row">
        <div className="col-md-7">
          <CarCanvas
            car={car}
            cars={cars}
            active={active}
            cameraPosition={cameraPosition}
          />
        </div>
        <div className="col-md-5">
          <HeroStats active={active}>
            <HeroStats.Title>{t.car.tech_sheet}</HeroStats.Title>

            <HeroStats.Row>
              <HeroStats.Item label={t.car.engine} value={car.stats.engine} />
              <HeroStats.Item
                label={t.car.displacement}
                value={car.stats.displacement}
              />
            </HeroStats.Row>

            <HeroStats.Row>
              <HeroStats.Item label={t.car.year} value={s.year} />
              <HeroStats.Item label={t.car.power} value={powerValue} />
            </HeroStats.Row>

            <HeroStats.Row>
              <HeroStats.Item label={t.car.drivetrain} value={s.drivetrain} />
              <HeroStats.Item
                label={t.car.transmission}
                value={s.transmission}
              />
            </HeroStats.Row>

            <HeroStats.Row>
              <HeroStats.Item
                label={t.car.weight}
                value={asWeight(s.weight_kg, lang)}
              />
              <HeroStats.Item
                label={t.car.zeroTo100}
                value={`${nf1(lang).format(s.zeroTo100_s)}s`}
              />
            </HeroStats.Row>

            <HeroStats.Row>
              <HeroStats.Item
                label={t.car.topSpeed}
                value={
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
                }
              />
              <HeroStats.Item
                label={t.car.wheelbase}
                value={asLengthMm(s.wheelbase_mm, lang)}
              />
            </HeroStats.Row>

            <HeroStats.Row>
              <HeroStats.Item
                label={t.car.dimensions}
                value={asDimensions(
                  {
                    length_mm: s.length_mm,
                    width_mm: s.width_mm,
                    height_mm: s.height_mm,
                  },
                  lang
                )}
                fullWidth
              />
            </HeroStats.Row>

            <HeroStats.Row>
              <HeroStats.Item
                label={t.car.price}
                value={priceLabel}
                fullWidth
              />
            </HeroStats.Row>
          </HeroStats>
        </div>
      </div>
    </section>
  );
}
