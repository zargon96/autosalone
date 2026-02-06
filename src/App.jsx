import "./App.css";
import { useState, memo, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CanvasProvider, useCanvas } from "./context/CanvasContext";
import { LangProvider } from "./context/langContext";
import Home from "./pages/Home";
import GlobalCanvas from "./components/GlobalCanvas";
import LightPillar from "./components/LightPillar";
import Preloader from "./components/Preloader";

const Credits = lazy(() => import("./pages/Credits"));
const Hero = lazy(() => import("./components/hero/Hero"));

export default function App() {
  const [ready, setReady] = useState(false);

  return (
    <Router>
      <CanvasProvider>
        <LangProvider>
          <Preloader done={ready} />
          <LightPillar />
          <CanvasWrapper onCanvasReady={() => setReady(true)} />
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

const CanvasWrapper = memo(function CanvasWrapper({ onCanvasReady }) {
  const { containerClass, mode } = useCanvas();

  useEffect(() => {
    const wrapper = document.getElementById("global-canvas-wrapper");
    if (!wrapper) return;

    if (containerClass === "hero-canvas") {
      const slot = document.getElementById("hero-canvas-slot");
      if (slot) slot.appendChild(wrapper);
    } else {
      const root = document.getElementById("global-canvas-root");
      if (root) root.appendChild(wrapper);
    }
  }, [containerClass]);

  if (mode === "hidden") return null;

  return (
    <div id="global-canvas-wrapper" className={containerClass}>
      <GlobalCanvas onReady={onCanvasReady} />
    </div>
  );
});
