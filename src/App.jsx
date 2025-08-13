import "./App.css";
import { LangProvider } from "./context/lang";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function App() {
  return (
    <>
      <LangProvider>
        <div className="bg-blobs">
          <div className="blob blob1"></div>
          <div className="blob blob2"></div>
        </div>
        <Navbar />
        <Hero />
      </LangProvider>
    </>
  );
}

export default App;
