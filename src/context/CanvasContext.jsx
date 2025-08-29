import { createContext, useContext, useState } from "react";

const CanvasContext = createContext();

export function CanvasProvider({ children }) {
  const [activeCarId, setActiveCarId] = useState(null);
  const [mode, setMode] = useState("static");
  const [homeIndex, setHomeIndex] = useState(0);
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
// eslint-disable-next-line react-refresh/only-export-components
export default function useCanvas() {
  return useContext(CanvasContext);
}
