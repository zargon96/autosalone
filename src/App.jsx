import "./App.css";
import { LangProvider } from "./context/lang";
import useCanvas from "./context/CanvasContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CanvasProvider } from "./context/CanvasContext";
import Home from "./pages/Home";
import Credits from "./pages/Credits";
import Hero from "./components/hero/Hero";
import GlobalCanvas from "./components/GlobalCanvas";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
function CanvasWrapper() {
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
}
