import { useLang } from "../context/langContext.jsx";
import { Navbar, Container } from "react-bootstrap";

export default function NavigationBar() {
  const { lang, setLang } = useLang();

  return (
    <Navbar variant="dark" expand="lg" className="pt-4">
      <Container>
        <div className="lang-switch">
          <button
            type="button"
            onClick={() => setLang("it")}
            className={`lang-btn ${lang === "it" ? "active" : ""}`}
            aria-label="Cambia lingua in Italiano"
          >
            IT
          </button>
          <span className="mx-2 text-color">|</span>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
            aria-label="Switch language to English"
          >
            EN
          </button>
        </div>
      </Container>
    </Navbar>
  );
}
