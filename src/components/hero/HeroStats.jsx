import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroStats({ statPairs, t, active }) {
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
      <div className="tech-sheet">
        <h2>{t.car.tech_sheet}</h2>

        {(() => {
          const rows = [];
          let tempRow = [];
          statPairs.forEach((stat) => {
            if (stat.fullWidth) {
              if (tempRow.length > 0) {
                rows.push(tempRow);
                tempRow = [];
              }
              rows.push([stat]);
            } else {
              tempRow.push({ label: stat[0], value: stat[1] });
              if (tempRow.length === 2) {
                rows.push(tempRow);
                tempRow = [];
              }
            }
          });
          if (tempRow.length > 0) rows.push(tempRow);

          return rows.map((row, i) => (
            <div className="row" key={i}>
              {row.map((stat, j) => (
                <div className={stat.fullWidth ? "col-12" : "col-md-6"} key={j}>
                  <p>
                    {stat.label}: {stat.value}
                  </p>
                </div>
              ))}
            </div>
          ));
        })()}
      </div>
    </div>
  );
}
