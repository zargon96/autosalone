import { memo } from "react";
import BlurText from "../ui/BlurText";
import ButtonGlobal from "../ui/ButtonGlobal";
import caretRight from "../../assets/caret-right-fill.svg";

const CarSection = memo(function CarSection({
  car,
  isFirst,
  isMobile,
  t,
  price,
  power,
  onNavigate,
  sectionRef,
}) {
  return (
    <section className="car-section" ref={sectionRef} aria-hidden={true}>
      <div className="title-top-left">
        <BlurText
          text={car.name}
          delay={50}
          animateBy="letters"
          direction="top"
          className="text-color car-title"
        />
      </div>

      <div className="price-top-right text-end">
        <BlurText
          text={price}
          delay={40}
          animateBy="letters"
          direction="top"
          className="text-color price-value"
        />
      </div>

      <div className="stats-bottom-center">
        {isFirst && (
          <div className="scroll-hint">
            {isMobile ? (
              <>
                <div className="swipe-arrow">↑</div>
                <span className="scroll-label">swipe up</span>
              </>
            ) : (
              <>
                <div className="scroll-mouse">
                  <div className="scroll-wheel" />
                </div>
                <span className="scroll-label">scroll</span>
              </>
            )}
          </div>
        )}

        <div className="stats-row">
          <div className="stat-item">
            <BlurText
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
              text={power}
              delay={40}
              animateBy="letters"
              direction="top"
              className="stat-value"
            />
            <span className="stat-label">{t.car.power}</span>
          </div>
          <ButtonGlobal
            className="btn-details"
            onClick={() => onNavigate(car.id)}
            pillarColors={car.pillarColors}
          >
            {t.car.details}
            <img src={caretRight} alt={t.car.next} />
          </ButtonGlobal>
        </div>
      </div>
    </section>
  );
});

export default CarSection;
