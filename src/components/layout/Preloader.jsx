import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import "../../styles/preloader.css";

export default function Preloader({ done }) {
  const { loaded, total, item } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [filesReady, setFilesReady] = useState(false);
  const raf = useRef(null);
  const hideTimer = useRef(null);
  const displayRef = useRef(0);
  const barRef = useRef(null);
  const textRef = useRef(null);
  const maxRatioRef = useRef(0);
  const seenTotalRef = useRef(0);

  if (total > 0) {
    seenTotalRef.current = Math.max(seenTotalRef.current, total);
    const ratio = loaded / seenTotalRef.current;
    maxRatioRef.current = Math.max(maxRatioRef.current, ratio);
  }

  const targetPct = done ? 100 : Math.min(99, maxRatioRef.current * 100);

  useEffect(() => {
    if (!filesReady && (done || targetPct >= 85)) {
      setFilesReady(true);
    }
  }, [targetPct, done, filesReady]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);

    const animate = () => {
      const prev = displayRef.current;
      const diff = targetPct - prev;

      if (Math.abs(diff) > 0.05) {
        const speed = done ? 0.3 : 0.1;
        const minStep = done ? 1 : 0.3;
        const next =
          prev + Math.sign(diff) * Math.max(Math.abs(diff) * speed, minStep);

        displayRef.current = Math.max(prev, next);
        const pct = Math.round(displayRef.current);
        if (barRef.current) barRef.current.style.width = `${pct}%`;
        if (textRef.current) textRef.current.textContent = `${pct}%`;

        raf.current = requestAnimationFrame(animate);
      } else {
        displayRef.current = Math.max(displayRef.current, targetPct);
        const pct = Math.round(displayRef.current);
        if (barRef.current) barRef.current.style.width = `${pct}%`;
        if (textRef.current) textRef.current.textContent = `${pct}%`;
      }
    };

    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [targetPct, done]);

  useEffect(() => {
    if (!done) return;
    hideTimer.current = setTimeout(() => setHidden(true), 1500);
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
          <div className="preloader-file preloader-phase">Almost ready...</div>
        )}
      </div>
    </div>
  );
}
