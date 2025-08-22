import { useEffect, useRef } from "react";
import gsap from "gsap";

function HeroStats({ children, active }) {
  const statsRef = useRef(null);

  useEffect(() => {
    if (!statsRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        statsRef.current.querySelectorAll("p, h1, h2"),
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }, statsRef);

    return () => ctx.revert();
  }, [active]);

  return (
    <div className="car-stats" ref={statsRef}>
      <div className="tech-sheet">{children}</div>
    </div>
  );
}

function Title({ children }) {
  return <h2>{children}</h2>;
}

function Row({ children }) {
  return <div className="row mb-2">{children}</div>;
}

function Item({ label, value, fullWidth = false }) {
  return (
    <div className={fullWidth ? "col-12" : "col-md-6"}>
      <p>
        {label}: {value}
      </p>
    </div>
  );
}

HeroStats.Title = Title;
HeroStats.Row = Row;
HeroStats.Item = Item;

export default HeroStats;
