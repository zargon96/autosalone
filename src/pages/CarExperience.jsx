import { useMemo, useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCanvas, useCanvasLive } from "../context/CanvasContext";
import { cars } from "../components/hero/carsData";
import caretLeft from "../assets/caret-left-fill.svg";
import caretRight from "../assets/caret-right-fill.svg";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ButtonGlobal from "../components/ButtonGlobal";
import { useLang } from "../context/langContext";
import FloatingCard from "../components/FloatingCard";
import MobileBottomSheet from "../components/MobileBottomSheet";
import "../styles/carexperience.css";

export default function CarExperience() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    setActiveCarId,
    setMode,
    setExperienceSteps,
    setOnStepClick,
    activeStep,
    setActiveStep,
  } = useCanvas();

  const { setExperienceCamera, setExperienceRotation } = useCanvasLive();

  const { t } = useLang();

  const car = useMemo(() => cars[id], [id]);
  const steps = useMemo(() => car?.experience ?? [], [car]);
  const carKeys = useMemo(() => Object.keys(cars), []);
  const currentCarIndex = useMemo(() => carKeys.indexOf(id), [carKeys, id]);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStepClick = useCallback(
    (step) => {
      setActiveStep(step);
      document.body.dataset.hotspots = "hidden";
      const rot = Array.isArray(step.rotation)
        ? step.rotation
        : typeof step.rotationY === "number"
          ? [0, step.rotationY, 0]
          : null;

      if (step.type === "focus") {
        setExperienceRotation(rot);
        setExperienceCamera(step.camera ?? null);
      }

      if (step.type === "rotate") {
        setExperienceRotation(rot ?? [0, 0, 0]);
        setExperienceCamera(null);
      }
    },
    [setActiveStep, setExperienceCamera, setExperienceRotation],
  );

  useEffect(() => {
    if (!car) return;

    setMode("experience");
    setActiveCarId(id);

    return () => {
      setExperienceCamera(null);
      setExperienceRotation(null);
      setExperienceSteps([]);
      setOnStepClick(null);
      setActiveStep(null);
      document.body.dataset.hotspots = "";
    };
  }, [
    id,
    car,
    setMode,
    setActiveCarId,
    setExperienceCamera,
    setExperienceRotation,
    setExperienceSteps,
    setOnStepClick,
    setActiveStep,
  ]);

  useEffect(() => {
    if (!car) return;
    setExperienceSteps(steps);
    setOnStepClick(() => handleStepClick);
  }, [steps, handleStepClick, car, setExperienceSteps, setOnStepClick]);

  const handleClose = () => {
    setActiveStep(null);
    setExperienceCamera(null);
    setExperienceRotation(null);
    document.body.dataset.hotspots = "";
  };

  if (!car) return null;

  return (
    <>
      <Navbar />
      <section className="container experience-content">
        <div className="row w-100">
          {!activeStep && (
            <div className="col-12 text-center">
              <h1 className="experience-title">{car.name}</h1>
            </div>
          )}

          <div className="col-12 experience-canvas-zone position-relative" />

          {!activeStep && isMobile && (
            <div className="col-12 mt-4">
              <div className="row g-2">
                {steps.map((step, index) => {
                  const isLast = index === steps.length - 1;

                  return (
                    <div
                      key={step.key}
                      className={`col-6 ${steps.length % 2 !== 0 && isLast ? "col-12" : ""} ${isLast ? "mb-5" : ""} mb-2`}
                    >
                      <ButtonGlobal
                        onClick={() => handleStepClick(step)}
                        className="w-100 mobile-step-btn"
                      >
                        {t.experience?.[car.id]?.[step.key]?.title}
                      </ButtonGlobal>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeStep &&
            (isMobile ? (
              <MobileBottomSheet
                title={t.experience?.[car.id]?.[activeStep.key]?.title}
                text={t.experience?.[car.id]?.[activeStep.key]?.text}
                onClose={handleClose}
              />
            ) : (
              <FloatingCard
                title={t.experience?.[car.id]?.[activeStep.key]?.title}
                text={t.experience?.[car.id]?.[activeStep.key]?.text}
                onClose={handleClose}
              />
            ))}

          {!activeStep && (
            <div className="col-12 text-center experience-back-btn d-flex justify-content-center align-items-center gap-3">
              <ButtonGlobal
                onClick={() =>
                  navigate(`/cars/${carKeys[currentCarIndex - 1]}/experience`)
                }
                disabled={currentCarIndex === 0}
              >
                <img src={caretLeft} alt="prev" className="icon-static" />
              </ButtonGlobal>

              <ButtonGlobal onClick={() => navigate(`/cars/${id}`)}>
                {t.experience?.back}
              </ButtonGlobal>

              <ButtonGlobal
                onClick={() =>
                  navigate(`/cars/${carKeys[currentCarIndex + 1]}/experience`)
                }
                disabled={currentCarIndex === carKeys.length - 1}
              >
                <img src={caretRight} alt="next" className="icon-static" />
              </ButtonGlobal>
            </div>
          )}
        </div>
      </section>

      {!activeStep && <Footer />}
    </>
  );
}
