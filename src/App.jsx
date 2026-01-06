import "./App.css";
import { memo, lazy, useEffect } from "react";
import { LangProvider } from "./context/langContext.jsx";
import { useCanvas, CanvasProvider } from "./context/CanvasContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
const Credits = lazy(() => import("./pages/Credits"));
const Hero = lazy(() => import("./components/hero/Hero"));
import GlobalCanvas from "./components/GlobalCanvas";
import LightPillar from "./components/LightPillar";

export default function App() {
  return (
    <Router>
      <CanvasProvider>
        <LangProvider>
          <LightPillar />
          {/* global canvas wrapper */}
          <CanvasWrapper />

          {/* routes */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars/:id" element={<Hero />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </LangProvider>
      </CanvasProvider>
    </Router>
  );
}

// wrapper that moves the global canvas in/out of hero slot or root
const CanvasWrapper = memo(function CanvasWrapper() {
  const { containerClass, mode } = useCanvas();

  useEffect(() => {
    if (containerClass === "hero-canvas") {
      const slot = document.getElementById("hero-canvas-slot");
      const wrapper = document.getElementById("global-canvas-wrapper");
      if (slot && wrapper) {
        slot.appendChild(wrapper);
      }
    } else {
      const root = document.getElementById("global-canvas-root");
      const wrapper = document.getElementById("global-canvas-wrapper");
      if (root && wrapper) {
        root.appendChild(wrapper);
      }
    }
  }, [containerClass]);

  // hide canvas if mode is "hidden"
  if (mode === "hidden") return null;

  return (
    <div id="global-canvas-wrapper" className={containerClass}>
      <GlobalCanvas />
    </div>
  );
});
