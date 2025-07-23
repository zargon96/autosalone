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
        <Navbar />
        <Hero />
      </LangProvider>
    </>
  );
}

export default App;
