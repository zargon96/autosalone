import { useState, useEffect, useCallback } from "react";
import useLang from "../context/useLang";
import { Navbar, Container } from "react-bootstrap";
import Switch from "../components/Switch";
import itFlag from "../assets/it.webp";
import enFlag from "../assets/en.webp";

export default function NavigationBar() {
  const { setLang } = useLang();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <Navbar variant="dark" expand="lg" className="pt-4">
      <Container>
        <div className="d-flex align-items-center">
          <img
            src={itFlag}
            alt="Italiano"
            style={{
              width: "38px",
              height: "auto",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => setLang("it")}
          />
          <img
            src={enFlag}
            alt="English"
            style={{
              width: "38px",
              height: "auto",
              cursor: "pointer",
              marginRight: "10px",
            }}
            onClick={() => setLang("en")}
          />
        </div>

        <Switch isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </Container>
    </Navbar>
  );
}
