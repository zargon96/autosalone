import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { allBrands } from "../components/cars/BrandFilter.jsx";

// context "stabile" — cambia raramente
const CanvasContext = createContext();

// context "live" — cambia spesso
const CanvasLiveContext = createContext();
const HomeIndexContext = createContext(0);

export function CanvasProvider({ children }) {
  const [activeCarId, setActiveCarId] = useState(null);
  const [mode, setMode] = useState("home");
  const [homeIndex, setHomeIndex] = useState(0);
  const [activeStep, setActiveStep] = useState(null);
  const [experienceSteps, setExperienceSteps] = useState([]);
  const [onStepClick, setOnStepClick] = useState(null);
  const [selectedBrands, setSelectedBrands] = useState(allBrands);

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

  const canvasValue = useMemo(
    () => ({
      activeCarId,
      setActiveCarId,
      mode,
      setMode,
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
      selectedBrands,
      setSelectedBrands,
    }),
    [
      activeCarId,
      mode,
      activeStep,
      experienceSteps,
      onStepClick,
      resetExperienceCamera,
      hotspotsReady,
      selectedBrands,
    ],
  );
  const liveValue = useMemo(
    () => ({
      experienceCamera,
      setExperienceCamera,
      experienceRotation,
      setExperienceRotation,
      hotspotPositions,
      setHotspotPositions,
    }),
    [experienceCamera, experienceRotation, hotspotPositions],
  );

  return (
    <HomeIndexContext.Provider value={homeIndex}>
      <CanvasContext.Provider value={canvasValue}>
        <CanvasLiveContext.Provider value={liveValue}>
          {children}
        </CanvasLiveContext.Provider>
      </CanvasContext.Provider>
    </HomeIndexContext.Provider>
  );
}

export function useCanvas() {
  return useContext(CanvasContext);
}

export function useCanvasLive() {
  return useContext(CanvasLiveContext);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useHomeIndex() {
  return useContext(HomeIndexContext);
}
