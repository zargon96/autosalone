import "./App.css";
import { Component, useState, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { CanvasProvider, useCanvas } from "./context/CanvasContext";
import { LangProvider } from "./context/langContext";
import Home from "./pages/Home";
import GlobalCanvas from "./components/canvas/GlobalCanvas";
import DiagonalBackground from "./components/background/DiagonalBackground";
import LightRays from "./components/LightRays";
import Preloader from "./components/layout/Preloader";
import Hero from "./components/cars/Hero";
import CarExperience from "./pages/CarExperience";

const Credits = lazy(() => import("./pages/Credits"));

class CanvasErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("The 3D canvas failed to render:", error, errorInfo);
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function PageBackground() {
  const { pathname } = useLocation();

  if (pathname === "/") {
    return <DiagonalBackground imageType="home" />;
  }
  if (/^\/cars\/[^/]+\/experience\/?$/.test(pathname)) {
    return (
      <LightRays
        raysOrigin="top-center"
        raysColor="#ffffff"
        raysSpeed={0.45}
        lightSpread={0.65}
        rayLength={1.8}
        rayDensity={0.6}
        raySharpness={0.3}
        glow={0.45}
        haze={0.12}
        atmosphere={0.4}
        intensity={0.65}
        pulsating={false}
        followMouse={false}
        mouseInfluence={0}
        cursorShadow={false}
        clickPulse={false}
        noiseAmount={0}
        distortion={0}
        intro={false}
        opacity={0.75}
        maxDevicePixelRatio={1.25}
        className="experience-light-rays"
      />
    );
  }
  if (/^\/cars\/[^/]+\/?$/.test(pathname)) {
    return <DiagonalBackground imageType="detail" />;
  }
  return null;
}

export default function App() {
  const [ready, setReady] = useState(false);
  return (
    <Router>
      <CanvasProvider>
        <LangProvider>
          <Preloader done={ready} />
          <CanvasLayer onReady={() => setReady(true)} />
          <PageBackground />

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
  const { pathname } = useLocation();
  const hasBackground =
    pathname === "/" || /^\/cars\/[^/]+(?:\/experience)?\/?$/.test(pathname);

  return (
    <div
      id="global-canvas-root"
      className={`canvas-${mode}${hasBackground ? " canvas-backgrounded" : ""}`}
    >
      <CanvasErrorBoundary>
        <GlobalCanvas onReady={onReady} />
      </CanvasErrorBoundary>
    </div>
  );
}
