import { useEffect, useLayoutEffect, useRef, useState, Suspense } from "react";
import useLang from "../context/useLang";
import useFxRates from "../components/hero/useFxRates";
import { nf0 } from "../components/hero/formatters";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import { cars } from "../components/hero/carsData";
import CarCanvasStatic from "../components/CarCanvasStatic";
import Loader3D from "../components/Loader3D";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import BlurText from "../components/BlurText";
import "../styles/home.css";

export default function Home() {
  const { t, lang } = useLang();
  const rates = useFxRates();
  const navigate = useNavigate();
  const carKeys = Object.keys(cars);
  const currentYear = new Date().getFullYear();
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const indexRef = useRef(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animatingRef = useRef(false);
  const touchStartY = useRef(null);
  const initDone = useRef(false);
  const wheelAccRef = useRef(0);

  const formatPower = (specs) => {
    if (!specs?.power_hp) return "—";
    const hp = specs.power_hp;
    if (lang === "it") {
      const cv = Math.round(hp * 1.014);
      return `${nf0("it").format(cv)} CV`;
    }
    return `${nf0("en").format(hp)} hp`;
  };

  const formatPrice = (eur) => {
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
  };

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overscrollBehavior = "";
    };
  }, []);

  useLayoutEffect(() => {
    if (initDone.current) return;
    initDone.current = true;
    const sections = sectionsRef.current.filter(Boolean);
    gsap.set(sections, {
      yPercent: (i) => (i === 0 ? 0 : 100),
      autoAlpha: (i) => (i === 0 ? 1 : 0),
      force3D: true,
    });
  }, []);

  const gotoSection = (nextIndex, dir) => {
    const sections = sectionsRef.current.filter(Boolean);
    const cur = indexRef.current;
    if (animatingRef.current) return;
    if (nextIndex < 0 || nextIndex >= sections.length) return;
    if (nextIndex === cur) return;

    animatingRef.current = true;
    setCurrentIndex(nextIndex);

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
  };

  useEffect(() => {
    const WHEEL_THRESHOLD = 100;

    const onWheel = (e) => {
      wheelAccRef.current += e.deltaY;
      if (wheelAccRef.current > WHEEL_THRESHOLD) {
        e.preventDefault();
        gotoSection(indexRef.current + 1, 1);
        wheelAccRef.current = 0;
      } else if (wheelAccRef.current < -WHEEL_THRESHOLD) {
        e.preventDefault();
        gotoSection(indexRef.current - 1, -1);
        wheelAccRef.current = 0;
      }
    };

    const onKey = (e) => {
      const down = ["ArrowDown", "PageDown"];
      const up = ["ArrowUp", "PageUp"];
      if (down.includes(e.key) || (e.key === " " && !e.shiftKey)) {
        e.preventDefault();
        gotoSection(indexRef.current + 1, 1);
      } else if (up.includes(e.key) || (e.key === " " && e.shiftKey)) {
        e.preventDefault();
        gotoSection(indexRef.current - 1, -1);
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
        ? gotoSection(indexRef.current + 1, 1)
        : gotoSection(indexRef.current - 1, -1);
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

        <div className="model-center">
          <Suspense fallback={<Loader3D />}>
            <CarCanvasStatic activeIndex={currentIndex} sideView />
          </Suspense>
        </div>

        {carKeys.map((key, i) => {
          const car = cars[key];
          const isActive = i === currentIndex;
          const activeCar = cars[carKeys[currentIndex]];

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
                  text={formatPrice(car.stats.price_eur)}
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

                <button
                  className="btn-details ms-2"
                  onClick={() => navigate(`/cars/${activeCar.id}`)}
                  type="button"
                >
                  {t.car.details}
                </button>
              </div>
            </section>
          );
        })}

        <div
          className="scroll-left"
          onClick={() => gotoSection(indexRef.current + 1, 1)}
        >
          <i className="bi bi-caret-down-fill bounce-icon"></i>
        </div>

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
