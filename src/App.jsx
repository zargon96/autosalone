import "./App.css";
import { useState, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CanvasProvider, useCanvas } from "./context/CanvasContext";
import { LangProvider } from "./context/langContext";
import Home from "./pages/Home";
import GlobalCanvas from "./components/GlobalCanvas";
import LightPillar from "./components/LightPillar";
import Preloader from "./components/Preloader";
import Hero from "./components/hero/Hero";
import CarExperience from "./pages/CarExperience";
import { cars } from "./components/hero/carsData";

const Credits = lazy(() => import("./pages/Credits"));

function DynamicLightPillar() {
  const { activeCarId } = useCanvas();
  const car = cars?.[activeCarId];

  return (
    <LightPillar
      topColor={car?.pillarColors?.top}
      midColor={car?.pillarColors?.middle}
      bottomColor={car?.pillarColors?.bottom}
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
