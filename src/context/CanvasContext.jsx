import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

// context "stabile" — cambia raramente
const CanvasContext = createContext();

// context "live" — cambia spesso
const CanvasLiveContext = createContext();

export function CanvasProvider({ children }) {
  const [activeCarId, setActiveCarId] = useState(null);
  const [mode, setMode] = useState("home");
  const [homeIndex, setHomeIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(null);
  const [experienceSteps, setExperienceSteps] = useState([]);
  const [onStepClick, setOnStepClick] = useState(null);

  // live — aggiornati frequentemente
  const [experienceCamera, setExperienceCamera] = useState(null);
  const [experienceRotation, setExperienceRotation] = useState(null);
  const [hotspotPositions, setHotspotPositions] = useState({});
  const [hotspotsReady, setHotspotsReady] = useState(true);
  const triggerCarTransition = useRef(null);
  const triggerCarTransitionY = useRef(null);

  const resetExperienceCamera = useCallback(() => {
    setExperienceCamera(null);
  }, []);

  return (
    <CanvasContext.Provider
      value={{
        activeCarId,
        setActiveCarId,
        mode,
        setMode,
        homeIndex,
        setHomeIndex,
        activeStep,
        setActiveStep,
        experienceSteps,
        setExperienceSteps,
        onStepClick,
        setOnStepClick,
        resetExperienceCamera,
        hotspotsReady,
        setHotspotsReady,
        triggerCarTransition,
        triggerCarTransitionY,
      }}
    >
      <CanvasLiveContext.Provider
        value={{
          experienceCamera,
          setExperienceCamera,
          experienceRotation,
          setExperienceRotation,
          hotspotPositions,
          setHotspotPositions,
        }}
      >
        {children}
      </CanvasLiveContext.Provider>
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  return useContext(CanvasContext);
}

export function useCanvasLive() {
  return useContext(CanvasLiveContext);
}
