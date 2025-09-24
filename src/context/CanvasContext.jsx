import { createContext, useContext, useState } from "react";

const CanvasContext = createContext();

export function CanvasProvider({ children }) {
  // id of the active car
  const [activeCarId, setActiveCarId] = useState(null);

  // current mode: "static" or "hero"
  const [mode, setMode] = useState("static");

  // index of the car shown on the home page
  const [homeIndex, setHomeIndex] = useState(0);

  // css class for canvas container
  const [containerClass, setContainerClass] = useState("model-center");

  return (
    <CanvasContext.Provider
      value={{
        activeCarId,
        setActiveCarId,
        mode,
        setMode,
        containerClass,
        setContainerClass,
        homeIndex,
        setHomeIndex,
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
}

// custom hook to access canvas context
export function useCanvas() {
  return useContext(CanvasContext);
}
