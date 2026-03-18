import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import "../../styles/preloader.css";

function AnimatedDots({ label }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <span>
      {label}
      {dots}
    </span>
  );
}

export default function Preloader({ done }) {
  const { progress, item } = useProgress();

  const [hidden, setHidden] = useState(false);
  const [filesReady, setFilesReady] = useState(false);

  const raf = useRef(null);
  const hideTimer = useRef(null);

  const displayRef = useRef(0);
  const barRef = useRef(null);
  const textRef = useRef(null);

  const targetPct = done ? 100 : Math.min(99, Math.max(0, progress || 0));

  useEffect(() => {
    if (!filesReady && progress >= 99.5 && !done) {
      setFilesReady(true);
    }
  }, [progress, done, filesReady]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);

    const animate = () => {
      const prev = displayRef.current;
      const diff = targetPct - prev;

      if (Math.abs(diff) > 0.05) {
        const speed = done ? 0.25 : 0.12;
        const next =
          prev + Math.sign(diff) * Math.max(Math.abs(diff) * speed, 0.4);

        displayRef.current = next;

        const pct = Math.round(next);

        if (barRef.current) barRef.current.style.width = `${pct}%`;

        if (textRef.current) textRef.current.textContent = `${pct}%`;

        raf.current = requestAnimationFrame(animate);
      } else {
        displayRef.current = targetPct;

        const pct = Math.round(targetPct);

        if (barRef.current) barRef.current.style.width = `${pct}%`;

        if (textRef.current) textRef.current.textContent = `${pct}%`;
      }
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [targetPct, done]);

  useEffect(() => {
    if (!done) return;

    hideTimer.current = setTimeout(() => {
      setHidden(true);
    }, 1500);

    return () => clearTimeout(hideTimer.current);
  }, [done]);

  if (hidden) return null;

  const fileName = item && !done && !filesReady ? item.split("/").pop() : null;

  return (
    <div className={`preloader-overlay${done ? " done" : ""}`}>
      <div className="preloader-box">
        <div className="preloader-bar">
          <div
            ref={barRef}
            className={`preloader-bar-fill${filesReady && !done ? " compiling" : ""}`}
            style={{ width: "0%" }}
          />
        </div>

        <div className="preloader-meta">
          <span ref={textRef}>0%</span>
        </div>

        {fileName && <div className="preloader-file">{fileName}</div>}

        {filesReady && !done && (
          <div className="preloader-file preloader-phase">
            <AnimatedDots label="Almost ready" />
          </div>
        )}
      </div>
    </div>
  );
}
