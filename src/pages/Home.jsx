import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLang } from "../context/langContext.jsx";
import useFxRates from "../components/hero/useFxRates";
import { nf0 } from "../components/hero/formatters";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import { cars } from "../components/hero/carsData";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import BlurText from "../components/BlurText";
import { useCanvas } from "../context/CanvasContext";
import "../styles/home.css";
import caretDown from "../assets/caret-down-fill.svg";
import caretUp from "../assets/caret-up-fill.svg";
import caretRight from "../assets/caret-right-fill.svg";
import ButtonGlobal from "../components/ButtonGlobal";

export default function Home() {
  const {
    setActiveCarId,
    setMode,
    setContainerClass,
    homeIndex,
    setHomeIndex,
  } = useCanvas();

  const { t, lang } = useLang();
  const rates = useFxRates();
  const navigate = useNavigate();
  const carKeys = useMemo(() => Object.keys(cars), []);
  const currentYear = new Date().getFullYear();

  // refs for scrolling and navigation
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const indexRef = useRef(homeIndex || 0);
  const [currentIndex, setCurrentIndex] = useState(homeIndex || 0);
  const animatingRef = useRef(false);
  const touchStartY = useRef(null);
  const initDone = useRef(false);
  const wheelAccRef = useRef(0);

  const gotoSectionRef = useRef(() => {});

  // format power depending on locale
  const formatPower = useCallback(
    (specs) => {
      if (!specs?.power_hp) return "—";
      const hp = specs.power_hp;
      if (lang === "it") {
        const cv = Math.round(hp * 1.014);
        return `${nf0("it").format(cv)} CV`;
      }
      return `${nf0("en").format(hp)} hp`;
    },
    [lang]
  );

  // format price depending on locale and fx rates
  const formatPrice = useCallback(
    (eur) => {
      if (!eur) return "—";
      if (lang === "en") {
        const gbpRate = rates?.rates?.GBP;
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
    },
    [lang, rates]
  );

  // lock body scroll
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehavior = "";
    };
  }, []);

  // init sections and set default car
  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    const sections = sectionsRef.current.filter(Boolean);

    requestAnimationFrame(() => {
      gsap.set(sections, {
        yPercent: (i) => (i === currentIndex ? 0 : 100),
        autoAlpha: (i) => (i === currentIndex ? 1 : 0),
        force3D: true,
      });
    });

    setMode("static");
    setActiveCarId(carKeys[currentIndex]);
    setContainerClass?.("model-center");
  }, [carKeys, currentIndex, setActiveCarId, setMode, setContainerClass]);

  // animate transition between sections
  const gotoSection = useCallback(
    (nextIndex, dir) => {
      const sections = sectionsRef.current.filter(Boolean);
      const cur = indexRef.current;
      if (animatingRef.current) return;
      if (nextIndex < 0 || nextIndex >= sections.length) return;
      if (nextIndex === cur) return;

      animatingRef.current = true;
      setCurrentIndex(nextIndex);
      setHomeIndex(nextIndex);
      setActiveCarId(carKeys[nextIndex]);

      const from = sections[cur];
      const to = sections[nextIndex];

      gsap
        .timeline({
          defaults: { ease: "power2.inOut", duration: 0.9 },
          onComplete: () => {
            indexRef.current = nextIndex;
            animatingRef.current = false;
            wheelAccRef.current = 0;
          },
        })
        .to(from, { yPercent: dir > 0 ? -100 : 100, autoAlpha: 0 }, 0)
        .fromTo(
          to,
          { yPercent: dir > 0 ? 100 : -100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1 },
          0
        );
    },
    [carKeys, setActiveCarId, setHomeIndex]
  );

  useEffect(() => {
    gotoSectionRef.current = gotoSection;
  }, [gotoSection]);

  // wheel, keyboard and touch navigation
  useEffect(() => {
    const WHEEL_THRESHOLD = 100;

    const onWheel = (e) => {
      wheelAccRef.current += e.deltaY;
      if (wheelAccRef.current > WHEEL_THRESHOLD) {
        e.preventDefault();
        gotoSectionRef.current(indexRef.current + 1, 1);
        wheelAccRef.current = 0;
      } else if (wheelAccRef.current < -WHEEL_THRESHOLD) {
        e.preventDefault();
        gotoSectionRef.current(indexRef.current - 1, -1);
        wheelAccRef.current = 0;
      }
    };

    const onKey = (e) => {
      const down = ["ArrowDown", "PageDown"];
      const up = ["ArrowUp", "PageUp"];
      if (down.includes(e.key) || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        gotoSectionRef.current(indexRef.current + 1, 1);
      } else if (up.includes(e.key) || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        gotoSectionRef.current(indexRef.current - 1, -1);
      }
    };

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e) => {
      if (touchStartY.current == null) return;
      const d = touchStartY.current - e.touches[0].clientY;
      if (Math.abs(d) < 50) return;
      e.preventDefault();
      d > 0
        ? gotoSectionRef.current(indexRef.current + 1, 1)
        : gotoSectionRef.current(indexRef.current - 1, -1);
      touchStartY.current = null;
    };
    const onTouchEnd = () => (touchStartY.current = null);

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  // current active car and price
  const activeCar = useMemo(
    () => cars[carKeys[currentIndex]],
    [carKeys, currentIndex]
  );

  const activePrice = useMemo(
    () => formatPrice(activeCar.stats.price_eur),
    [activeCar, formatPrice]
  );

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="showcase-container container">
        {/* section indicator */}
        <div className="section-indicator">
          <span className="current-section">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
        </div>

        {/* social links */}
        <div className="social-vertical">
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

        {/* cars */}
        {carKeys.map((key, i) => {
          const car = cars[key];
          const isActive = i === currentIndex;

          return (
            <section
              className="car-section"
              key={car.id}
              ref={(el) => (sectionsRef.current[i] = el)}
              aria-hidden={!isActive}
            >
              <div className="title-top-left">
                <BlurText
                  key={`${currentIndex}-${car.id}-title`}
                  text={car.name}
                  delay={50}
                  animateBy="letters"
                  direction="top"
                  className="text-color car-title"
                />
              </div>

              <div className="price-top-right text-end">
                <BlurText
                  key={`${currentIndex}-${car.id}-price`}
                  text={
                    isActive ? activePrice : formatPrice(car.stats.price_eur)
                  }
                  delay={40}
                  animateBy="letters"
                  direction="top"
                  className="text-color price-value"
                />
              </div>

              <div className="stats-bottom-center">
                <div className="stat-item">
                  <BlurText
                    key={`${currentIndex}-${car.id}-year`}
                    text={String(car.specs?.year)}
                    delay={20}
                    animateBy="letters"
                    direction="top"
                    className="stat-value"
                  />
                  <span className="stat-label">{t.car.year}</span>
                </div>

                <div className="stat-item">
                  <BlurText
                    key={`${currentIndex}-${car.id}-disp`}
                    text={String(car.stats?.displacement)}
                    delay={30}
                    animateBy="letters"
                    direction="top"
                    className="stat-value"
                  />
                  <span className="stat-label">{t.car.displacement}</span>
                </div>

                <div className="stat-item">
                  <BlurText
                    key={`${currentIndex}-${car.id}-power`}
                    text={formatPower(car.specs)}
                    delay={40}
                    animateBy="letters"
                    direction="top"
                    className="stat-value"
                  />
                  <span className="stat-label">{t.car.power}</span>
                </div>

                <ButtonGlobal
                  className="btn-details"
                  onClick={() => navigate(`/cars/${activeCar.id}`)}
                >
                  {t.car.details}
                  <img
                    src={caretRight}
                    alt={t.car.next}
                    className="icon-static"
                  />
                </ButtonGlobal>
              </div>
            </section>
          );
        })}

        {/* scroll controls */}
        <div
          className="scroll-left"
          onClick={() => gotoSectionRef.current(carKeys.length - 1, 1)}
        >
          <img
            src={caretDown}
            alt={t.car.scroll_down}
            className="bounce-icon"
          />
        </div>
        <div
          className="scroll-right"
          onClick={() => gotoSectionRef.current(0, -1)}
        >
          <img src={caretUp} alt={t.car.back_to_top} className="bounce-icon" />
        </div>

        {/* footer */}
        <footer className="footer2 container">
          <p className="footer-text text-color">
            © <time dateTime={String(currentYear)}>{currentYear}</time>{" "}
            {t.footer.brand}. {t.footer.text}
          </p>
          <p className="footer-text credits">
            <Link to="/credits" className="text-color">
              Credits & Licenses
            </Link>
          </p>
        </footer>
      </div>
    </>
  );
}
