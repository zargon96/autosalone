// import { createContext, useContext, useState, useCallback } from "react";

// const CanvasContext = createContext();

// export function CanvasProvider({ children }) {
//   const [activeCarId, setActiveCarId] = useState(null);
//   const [mode, setMode] = useState("home");
//   const [homeIndex, setHomeIndex] = useState(0);
//   const [experienceCamera, setExperienceCamera] = useState(null);
//   const [experienceRotation, setExperienceRotation] = useState(null);
//   const [experienceSteps, setExperienceSteps] = useState([]);
//   const [onStepClick, setOnStepClick] = useState(null);
//   const [hotspotPositions, setHotspotPositions] = useState({});
//   const [activeStep, setActiveStep] = useState(null);

//   const resetExperienceCamera = useCallback(() => {
//     setExperienceCamera(null);
//   }, []);

//   return (
//     <CanvasContext.Provider
//       value={{
//         activeCarId,
//         setActiveCarId,
//         mode,
//         setMode,
//         homeIndex,
//         setHomeIndex,
//         experienceRotation,
//         setExperienceRotation,
//         experienceCamera,
//         setExperienceCamera,
//         resetExperienceCamera,
//         experienceSteps,
//         setExperienceSteps,
//         onStepClick,
//         setOnStepClick,
//         hotspotPositions,
//         setHotspotPositions,
//         activeStep,
//         setActiveStep,
//       }}
//     >
//       {children}
//     </CanvasContext.Provider>
//   );
// }

// export function useCanvas() {
//   return useContext(CanvasContext);
// }

import { createContext, useContext, useState, useCallback } from "react";

// context "stabile" — cambia raramente
const CanvasContext = createContext();

// context "live" — cambia spesso (hotspot, camera, rotation)
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

// hook separato per le cose live — usalo solo dove serve
export function useCanvasLive() {
  return useContext(CanvasLiveContext);
}
