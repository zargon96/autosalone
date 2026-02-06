import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import "../styles/preloader.css";

export default function Preloader({ done }) {
  const { progress, item } = useProgress();
  const [hidden, setHidden] = useState(false);

  const hideTimer = useRef(null);

  const pct = done ? 100 : Math.min(99, Math.max(0, Math.round(progress || 0)));

  const label = done ? "Ready" : pct >= 99 ? "Finalizing" : "Loading assets";

  useEffect(() => {
    if (!done) return;

    hideTimer.current = setTimeout(() => setHidden(true), 650);

    return () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, [done]);

  if (hidden) return null;

  return (
    <div className={`preloader-overlay ${done ? "done" : ""}`}>
      <div className="preloader-box">
        <div className="preloader-title">{label}</div>

        <div className="preloader-bar">
          <div className="preloader-bar-fill" style={{ width: `${pct}%` }} />
        </div>

        <div className="preloader-meta">
          <span>{pct}%</span>
          <span />
        </div>
      </div>
    </div>
  );
}
