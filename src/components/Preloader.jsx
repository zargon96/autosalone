import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import "../styles/preloader.css";

export default function Preloader({ done }) {
  const { progress, item } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);
  const [filesReady, setFilesReady] = useState(false);
  const raf = useRef(null);
  const hideTimer = useRef(null);

  const targetPct = done ? 100 : Math.min(99, Math.max(0, progress || 0));

  useEffect(() => {
    if (progress >= 99.5 && !done) setFilesReady(true);
  }, [progress, done]);

  useEffect(() => {
    cancelAnimationFrame(raf.current);
    const animate = () => {
      setDisplayPct((prev) => {
        const diff = targetPct - prev;
        if (Math.abs(diff) < 0.05) return targetPct;
        return prev + Math.sign(diff) * Math.max(Math.abs(diff) * 0.12, 0.4);
      });
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [targetPct]);

  useEffect(() => {
    if (!done) return;
    hideTimer.current = setTimeout(() => setHidden(true), 700);
    return () => clearTimeout(hideTimer.current);
  }, [done]);

  if (hidden) return null;

  const pct = Math.round(displayPct);
  const fileName = item && !done && !filesReady ? item.split("/").pop() : null;

  return (
    <div className={`preloader-overlay${done ? " done" : ""}`}>
      <div className="preloader-box">
        <div className="preloader-bar">
          <div className="preloader-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="preloader-meta">
          <span>{pct}%</span>
        </div>

        {fileName && <div className="preloader-file">{fileName}</div>}

        {filesReady && !done && (
          <div className="preloader-file preloader-phase">
            Compiling shaders...
          </div>
        )}
      </div>
    </div>
  );
}
