import { useEffect, useRef, useState, useMemo } from "react";
import { useProgress } from "@react-three/drei";
import "../styles/preloader.css";

export default function Preloader({ done }) {
  const { progress, item } = useProgress();

  const [hidden, setHidden] = useState(false);
  const [displayPct, setDisplayPct] = useState(0);

  const hideTimer = useRef(null);
  const raf = useRef(null);

  const targetPct = done
    ? 100
    : Math.min(99, Math.max(0, Math.round(progress || 0)));

  useEffect(() => {
    if (Math.abs(displayPct - targetPct) < 0.1) return;

    const animate = () => {
      setDisplayPct((prev) => {
        const diff = targetPct - prev;
        if (Math.abs(diff) < 0.1) return targetPct;
        return prev + diff * 0.08;
      });
      raf.current = requestAnimationFrame(animate);
    };

    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [targetPct]);

  const pct = Math.round(displayPct);

  const currentItem = useMemo(() => {
    if (!item || done) return null;
    const parts = item.split("/");
    return parts[parts.length - 1];
  }, [item, done]);

  useEffect(() => {
    if (!done) return;

    hideTimer.current = setTimeout(() => {
      setHidden(true);
    }, 650);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [done]);

  if (hidden) return null;

  return (
    <div className={`preloader-overlay ${done ? "done" : ""}`}>
      <div className="preloader-box">
        <div className="preloader-bar">
          <div className="preloader-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="preloader-meta">
          <span>{pct}%</span>
        </div>

        {currentItem && <div className="preloader-file">{currentItem}</div>}
      </div>
    </div>
  );
}
