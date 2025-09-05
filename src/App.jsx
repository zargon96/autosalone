import "./App.css";
import { memo, lazy } from "react";
import { LangProvider } from "./context/langContext.jsx";
import { useCanvas, CanvasProvider } from "./context/CanvasContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
const Credits = lazy(() => import("./pages/Credits"));
const Hero = lazy(() => import("./components/hero/Hero"));
import GlobalCanvas from "./components/GlobalCanvas";
export default function App() {
  return (
    <Router>
      <CanvasProvider>
        <LangProvider>
          <div className="bg-blobs">
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
          </div>
          <CanvasWrapper />
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

const CanvasWrapper = memo(function CanvasWrapper() {
  const { containerClass, mode } = useCanvas();
  return (
    <div
      className={`canvas-container ${containerClass} ${
        mode === "hidden" ? "canvas-hidden" : ""
      }`}
    >
      <GlobalCanvas />
    </div>
  );
});
