import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useLang } from "../context/langContext.jsx";
import useFxRates from "../components/cars/useFxRates.js";
import { nf0 } from "../components/cars/formatters.js";
import gsap from "gsap";
import Navbar from "../components/layout/Navbar.jsx";
import { cars } from "../components/cars/carsData.js";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useCanvas } from "../context/CanvasContext";
import "../styles/home.css";
import CarSection from "../components/cars/CarSection.jsx";

const currentYear = new Date().getFullYear();

export default function Home() {
  const {
    setActiveCarId,
    setMode,
    homeIndex,
    setHomeIndex,
    triggerCarTransitionY,
  } = useCanvas();

  const { t, lang } = useLang();
  const rates = useFxRates();
  const navigate = useNavigate();
  const carKeys = useMemo(() => Object.keys(cars), []);

  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const indexRef = useRef(homeIndex || 0);
  const [currentIndex, setCurrentIndex] = useState(homeIndex || 0);
  const animatingRef = useRef(false);
  const touchStartY = useRef(null);
  const initDone = useRef(false);
  const wheelAccRef = useRef(0);
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  const gotoSectionRef = useRef(() => {});

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
    [lang],
  );

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
    [lang, rates],
  );

  // handleNavigate DENTRO il componente, non fuori
  const handleNavigate = useCallback(
    (id) => navigate(`/cars/${id}`),
    [navigate],
  );

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehavior = "";
    };
  }, []);

  useEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    const sections = sectionsRef.current.filter(Boolean);

    requestAnimationFrame(() => {
      gsap.set(sections, {
        yPercent: (i) => (i === indexRef.current ? 0 : 100),
        autoAlpha: (i) => (i === indexRef.current ? 1 : 0),
        force3D: true,
      });
    });

    setMode("static");
    setActiveCarId(carKeys[indexRef.current]);
  }, [carKeys, setActiveCarId, setMode]);

  const gotoSection = useCallback(
    (nextIndex, dir) => {
      const sections = sectionsRef.current.filter(Boolean);
      const cur = indexRef.current;
      if (animatingRef.current) return;
      if (nextIndex < 0 || nextIndex >= sections.length) return;
      if (nextIndex === cur) return;

      animatingRef.current = true;
      indexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      setHomeIndex(nextIndex);

      const from = sections[cur];
      const to = sections[nextIndex];

      triggerCarTransitionY.current?.(dir > 0 ? "next" : "prev", () => {
        setActiveCarId(carKeys[nextIndex]);
      });

      gsap
        .timeline({
          defaults: { ease: "power2.inOut", duration: 0.9 },
          onComplete: () => {
            animatingRef.current = false;
            wheelAccRef.current = 0;
          },
        })
        .to(from, { yPercent: dir > 0 ? -100 : 100, autoAlpha: 0 }, 0)
        .fromTo(
          to,
          { yPercent: dir > 0 ? 100 : -100, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1 },
          0,
        );
    },
    [carKeys, setActiveCarId, setHomeIndex, triggerCarTransitionY],
  );

  useEffect(() => {
    gotoSectionRef.current = gotoSection;
  }, [gotoSection]);

  useEffect(() => {
    const WHEEL_THRESHOLD = 100;

    const onWheel = (e) => {
      if (animatingRef.current) return;
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
      if (animatingRef.current) return;
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

  return (
    <>
      <Navbar />
      <div ref={containerRef} className="showcase-container container">
        <div className="section-indicator">
          <span className="current-section">
            {String(currentIndex + 1).padStart(2, "0")}
          </span>
        </div>

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

        {carKeys.map((key, i) => {
          const car = cars[key];
          return (
            <CarSection
              key={key}
              car={car}
              isFirst={i === 0}
              isMobile={isMobile}
              t={t}
              price={formatPrice(car.stats.price_eur)}
              power={formatPower(car.specs)}
              onNavigate={handleNavigate}
              sectionRef={(el) => (sectionsRef.current[i] = el)}
            />
          );
        })}

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
