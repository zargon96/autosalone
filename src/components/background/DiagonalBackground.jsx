import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { motion } from "motion/react";
import { useCanvas } from "../../context/CanvasContext";
import { cars } from "../cars/carsData";
import "./DiagonalBackground.css";

const firstCarId = Object.keys(cars)[0];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COLOR_REVEAL_START = "polygon(99% 0, 100% 0, 100% 1%)";
const COLOR_REVEAL_END = "polygon(0 0, 100% 0, 0 100%)";
const IMAGE_REVEAL_START = "polygon(0 99%, 1% 100%, 0 100%)";
const IMAGE_REVEAL_END = "polygon(100% 0, 100% 100%, 0 100%)";
const FULL_REVEAL_END = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
const MotionDiv = motion.div;
const MotionImage = motion.img;

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    const updatePreference = (event) => setReducedMotion(event.matches);

    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

function BackgroundImage({ src, className, onReady, onError }) {
  const imageRef = useRef(null);

  const handleLoad = useCallback(() => {
    onReady(src);
  }, [onReady, src]);

  const handleError = useCallback(() => {
    console.warn(`Unable to load background image: ${src}`);
    onError(src);
  }, [onError, src]);

  return (
    <img
      ref={imageRef}
      className={`diagonal-background__image ${className}`}
      src={src}
      alt=""
      aria-hidden="true"
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}

function DetailDiagonalBackground({ imageType }) {
  const { activeCarId } = useCanvas();
  const backgroundRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const car = cars[activeCarId] ?? cars[firstCarId];
  const color = car?.backgroundColor ?? "#101114";
  const media =
    imageType === "detail"
      ? car?.detailBackgroundImage
      : car?.backgroundImage;
  const [mediaTransition, setMediaTransition] = useState(() => ({
    active: media,
    outgoing: null,
    ready: !media,
  }));
  const handleMediaReady = useCallback((src) => {
    setMediaTransition((current) =>
      current.active === src ? { ...current, ready: true } : current,
    );
  }, []);
  const handleMediaError = useCallback((src) => {
    setMediaTransition((current) =>
      current.active === src
        ? { active: null, outgoing: current.outgoing, ready: true }
        : current,
    );
  }, []);

  useEffect(() => {
    const background = backgroundRef.current;
    if (!background) return;

    gsap.to(background, {
      backgroundColor: color,
      duration: reducedMotion ? 0 : 0.7,
      ease: "power2.inOut",
      overwrite: true,
    });
  }, [color, reducedMotion]);

  useEffect(() => {
    setMediaTransition((current) => {
      if (current.active === media) return current;
      return {
        active: media,
        outgoing: current.active,
        ready: !media,
      };
    });
  }, [media]);

  useEffect(() => {
    if (!mediaTransition.ready || !mediaTransition.outgoing) return undefined;

    const timeout = window.setTimeout(() => {
      setMediaTransition((current) => ({
        ...current,
        outgoing: null,
      }));
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [mediaTransition.active, mediaTransition.outgoing, mediaTransition.ready]);

  const renderMedia = (src, role) => {
    if (!src) return null;
    const isActive = role === "active";
    const visible = isActive ? mediaTransition.ready : !mediaTransition.ready;
    const className = [
      isActive ? "is-active" : "is-outgoing",
      visible ? "is-visible" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <BackgroundImage
        key={src}
        src={src}
        className={className}
        onReady={handleMediaReady}
        onError={handleMediaError}
      />
    );
  };

  return (
    <div className="diagonal-background" aria-hidden="true">
      <div
        ref={backgroundRef}
        className="diagonal-background__color"
        style={{ backgroundColor: color }}
      />
      {renderMedia(mediaTransition.outgoing, "outgoing")}
      {renderMedia(mediaTransition.active, "active")}
      <svg
        className="diagonal-background__divider"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          stroke="#fff"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function HomeDiagonalBackground() {
  const { activeCarId } = useCanvas();
  const reducedMotion = usePrefersReducedMotion();
  const currentCarId = activeCarId ?? firstCarId;
  const displayedCarRef = useRef(currentCarId);
  const observedCarIdRef = useRef(currentCarId);
  const transitionRef = useRef(null);
  const [transition, setTransition] = useState(null);
  transitionRef.current = transition;

  const finishTransition = useCallback(
    (carId) => {
      const currentTransition = transitionRef.current;
      if (currentTransition?.to !== carId || !currentTransition.ready) return;

      displayedCarRef.current = carId;
      setTransition(null);
    },
    [],
  );

  useLayoutEffect(() => {
    if (observedCarIdRef.current === currentCarId) return;
    observedCarIdRef.current = currentCarId;

    if (reducedMotion) {
      displayedCarRef.current = currentCarId;
      setTransition(null);
      return;
    }

    if (displayedCarRef.current === currentCarId) {
      setTransition(null);
      return;
    }

    const nextCar = cars[currentCarId] ?? cars[firstCarId];
    setTransition({
      from: displayedCarRef.current,
      to: currentCarId,
      ready: !nextCar.backgroundImage,
      imageFailed: false,
    });
  }, [currentCarId, reducedMotion]);

  useEffect(() => {
    if (!transition || transition.ready) return undefined;

    const car = cars[transition.to] ?? cars[firstCarId];
    const src = car.backgroundImage;
    if (!src) return undefined;

    let active = true;
    const image = new Image();
    const markReady = async () => {
      try {
        if (typeof image.decode === "function") await image.decode();
        if (!active) return;

        setTransition((current) =>
          current?.to === transition.to && !current.ready
            ? { ...current, ready: true }
            : current,
        );
      } catch {
        if (!active) return;

        console.warn(`Unable to decode background image: ${src}`);
        setTransition((current) =>
          current?.to === transition.to
            ? { ...current, ready: true, imageFailed: true }
            : current,
        );
      }
    };
    const markFailed = () => {
      if (!active) return;

      console.warn(`Unable to load background image: ${src}`);
      setTransition((current) =>
        current?.to === transition.to
          ? { ...current, ready: true, imageFailed: true }
          : current,
      );
    };

    image.addEventListener("load", markReady);
    image.addEventListener("error", markFailed);
    image.src = src;
    if (image.complete) {
      if (image.naturalWidth > 0) {
        markReady();
      } else {
        markFailed();
      }
    }

    return () => {
      active = false;
      image.removeEventListener("load", markReady);
      image.removeEventListener("error", markFailed);
    };
  }, [transition]);

  const renderScene = (carId, incoming = false) => {
    const car = cars[carId] ?? cars[firstCarId];
    const imageSrc = car.backgroundImage;
    const sceneClassName = incoming
      ? "diagonal-background__scene is-incoming"
      : "diagonal-background__scene";

    return (
      <div key={carId} className={sceneClassName}>
        {incoming ? (
          <>
            <MotionDiv
              className="diagonal-background__color"
              style={{ backgroundColor: car.backgroundColor ?? "#101114" }}
              initial={{ clipPath: COLOR_REVEAL_START }}
              animate={{
                clipPath:
                  transition.ready && !imageSrc
                    ? FULL_REVEAL_END
                    : transition.ready && transition.imageFailed
                      ? FULL_REVEAL_END
                      : transition.ready
                        ? COLOR_REVEAL_END
                        : COLOR_REVEAL_START,
              }}
              transition={{
                duration: reducedMotion ? 0 : 1.04,
                ease: [0.42, 0, 0.58, 1],
              }}
              onAnimationComplete={() => finishTransition(carId)}
            />
            {imageSrc && !transition.imageFailed && (
              <MotionImage
                className="diagonal-background__image"
                src={imageSrc}
                alt=""
                aria-hidden="true"
                decoding="async"
                initial={{
                  clipPath: IMAGE_REVEAL_START,
                  scale: 1.025,
                }}
                animate={{
                  clipPath: transition.ready
                    ? IMAGE_REVEAL_END
                    : IMAGE_REVEAL_START,
                  scale: transition.ready ? 1 : 1.025,
                }}
                transition={{
                  duration: reducedMotion ? 0 : 1,
                  delay: reducedMotion ? 0 : 0.04,
                  ease: [0.42, 0, 0.58, 1],
                }}
              />
            )}
          </>
        ) : (
          <>
            <div
              className="diagonal-background__color"
              style={{ backgroundColor: car.backgroundColor ?? "#101114" }}
            />
            {imageSrc && (
              <img
                className="diagonal-background__image"
                src={imageSrc}
                alt=""
                aria-hidden="true"
                decoding="async"
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="diagonal-background" aria-hidden="true">
      {transition ? (
        <>
          {renderScene(transition.from)}
          {renderScene(transition.to, true)}
        </>
      ) : (
        renderScene(currentCarId)
      )}
      <svg
        className="diagonal-background__divider"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          x1="0"
          y1="100"
          x2="100"
          y2="0"
          stroke="#fff"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default function DiagonalBackground({ imageType = "home" }) {
  return imageType === "home" ? (
    <HomeDiagonalBackground />
  ) : (
    <DetailDiagonalBackground imageType={imageType} />
  );
}
