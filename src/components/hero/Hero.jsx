import { useMemo, useEffect, useCallback } from "react";
import { useGLTF } from "@react-three/drei";
import { useParams, useNavigate } from "react-router-dom";
import { useLang } from "../../context/langContext";
import { useCanvas } from "../../context/CanvasContext";
import { cars } from "./carsData";
import BlurText from "../BlurText";
import CountUp from "../CountUp";
import HeroStats from "./HeroStats";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import useFxRates from "./useFxRates";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import {
  nf0,
  nf1,
  asWeight,
  asLengthMm,
  asDimensions,
  KMH_TO_MPH,
} from "./formatters";

import "../../styles/hero.css";
import "../../styles/footer.css";

export default function Hero() {
  const { t, lang } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const { setActiveCarId, setMode, setContainerClass, setHomeIndex } =
    useCanvas();
  const carKeys = useMemo(() => Object.keys(cars), []);
  const active = useMemo(() => {
    const idx = carKeys.indexOf(id);
    return idx >= 0 ? idx : 0;
  }, [id, carKeys]);

  useEffect(() => {
    if (!carKeys[active]) return;
    useGLTF.preload(cars[carKeys[active]].model);
  }, [active, carKeys]);

  const car = useMemo(() => cars[carKeys[active]], [carKeys, active]);
  const s = useMemo(() => car.specs, [car]);

  const rates = useFxRates();

  useEffect(() => {
    setMode("hero");
    setActiveCarId(car.id);
    setContainerClass?.("hero-canvas");

    return () => {
      setMode("static");
      setContainerClass?.("model-center");
    };
  }, [car, setMode, setActiveCarId, setContainerClass]);

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

  const goHome = useCallback(() => {
    setMode("static");
    setContainerClass("model-center");
    setHomeIndex(active);
    navigate("/");
  }, [setMode, setContainerClass, navigate, active]);

  return (
    <>
      <Navbar />
      <section className="container mt-4">
        <div className="row hero-content">
          <div className="col-md-12">
            <h1 className="m-0">
              <BlurText
                key={active}
                text={car.name}
                delay={50}
                animateBy="letters"
                direction="top"
                className="text-color title-car"
              />
            </h1>
          </div>
          <div className="row">
            <div className="col-md-6">
              <button
                className="btn-details mt-2"
                onClick={goHome}
                type="button"
              >
                ← {t.car.back_home}
              </button>
            </div>
            <div className="col-md-6 mb-5">
              <div className="hero-topbar d-flex justify-content-end align-items-center">
                <div className="footer-icons">
                  <a
                    href="https://github.com/zargon96"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.github_aria}
                  >
                    <FontAwesomeIcon icon={faGithub} size="2x" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/marcocrucitti96/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t.footer.linkedin_aria}
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="2x" />
                  </a>
                </div>
              </div>

              <HeroStats active={active}>
                <HeroStats.Title>{t.car.tech_sheet}</HeroStats.Title>

                <HeroStats.Row>
                  <HeroStats.Item
                    label={t.car.engine}
                    value={car.stats.engine}
                  />
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
                  <HeroStats.Item
                    label={t.car.drivetrain}
                    value={s.drivetrain}
                  />
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
          <div className="row">
            <div className="col-6">
              <button
                type="button"
                className="btn-details mb-5"
                onClick={() => {
                  if (active > 0) {
                    navigate(`/cars/${carKeys[active - 1]}`);
                    if (window.innerWidth < 768) {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }
                }}
                disabled={active === 0}
              >
                ← {t.car.prev}
              </button>
            </div>

            <div className="col-6">
              <div className="box-next">
                <button
                  type="button"
                  className="btn-details mb-5"
                  onClick={() => {
                    if (active < carKeys.length - 1) {
                      navigate(`/cars/${carKeys[active + 1]}`);
                      if (window.innerWidth < 768) {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }
                  }}
                  disabled={active === carKeys.length - 1}
                >
                  {t.car.next} →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
