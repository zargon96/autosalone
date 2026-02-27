import "./App.css";
import { useState, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CanvasProvider, useCanvas } from "./context/CanvasContext";
import { LangProvider } from "./context/langContext";
import Home from "./pages/Home";
import GlobalCanvas from "./components/canvas/GlobalCanvas";
import LightPillar from "./components/cars/LightPillar";
import Preloader from "./components/layout/Preloader";
import Hero from "./components/cars/Hero";
import CarExperience from "./pages/CarExperience";
import { cars } from "./components/cars/carsData";

const Credits = lazy(() => import("./pages/Credits"));

function DynamicLightPillar() {
  const { activeCarId } = useCanvas();
  const car = cars?.[activeCarId];
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const colors = [
      car?.pillarColors?.top,
      car?.pillarColors?.middle,
      car?.pillarColors?.bottom,
    ];

    const hasWhite = colors.some(
      (c) => c?.toLowerCase() === "#ffffff" || c?.toLowerCase() === "#fff",
    );

    document.documentElement.style.setProperty(
      "--text-color",
      hasWhite ? "#000000" : "#ffffff",
    );
  }, [activeCarId, car]);

  return (
    <LightPillar
      topColor={car?.pillarColors?.top}
      midColor={car?.pillarColors?.middle}
      bottomColor={car?.pillarColors?.bottom}
      pillarWidth={3.0}
      pillarRotation={116}
      pillarHeight={0.4}
      gradientSpread={isMobile ? 4.0 : 12.0}
      intensity={1.1}
      glowAmount={0.008}
    />
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <Router>
      <CanvasProvider>
        <LangProvider>
          <Preloader done={ready} />
          <CanvasLayer onReady={() => setReady(true)} />
          <DynamicLightPillar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars/:id" element={<Hero />} />
            <Route path="/cars/:id/experience" element={<CarExperience />} />
            <Route path="/credits" element={<Credits />} />
          </Routes>
        </LangProvider>
      </CanvasProvider>
    </Router>
  );
}
function CanvasLayer({ onReady }) {
  const { mode } = useCanvas();

  return (
    <div id="global-canvas-root" className={`canvas-${mode}`}>
      <GlobalCanvas onReady={onReady} />
    </div>
  );
}
