import "./App.css";
import { useState, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CanvasProvider, useCanvas } from "./context/CanvasContext";
import { LangProvider } from "./context/langContext";
import Home from "./pages/Home";
import GlobalCanvas from "./components/GlobalCanvas";
import LightPillar from "./components/LightPillar";
import Preloader from "./components/Preloader";
import Hero from "./components/hero/Hero";
import CarExperience from "./pages/CarExperience";

const Credits = lazy(() => import("./pages/Credits"));

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <Router>
      <CanvasProvider>
        <LangProvider>
          <ScrollReset />
          <Preloader done={ready} />
          <CanvasLayer onReady={() => setReady(true)} />
          <LightPillar />

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
