import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCanvas } from "../../context/CanvasContext";
import { cars } from "../cars/carsData";
import "./DiagonalBackground.css";

const firstCarId = Object.keys(cars)[0];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

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

export default function DiagonalBackground({ imageType = "home" }) {
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
