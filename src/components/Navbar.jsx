import { useState, useEffect, useCallback } from "react";
import { useLang } from "../context/langContext.jsx";
import { Navbar, Container } from "react-bootstrap";
import Switch from "../components/Switch";

export default function NavigationBar() {
  const { lang, setLang } = useLang();

  // state for dark mode
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // apply theme class to root and persist in localstorage
  // useEffect(() => {
  //   const root = document.documentElement;
  //   const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  //   if (isDarkMode) {
  //     root.classList.add("dark-mode");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     root.classList.remove("dark-mode");
  //     localStorage.setItem("theme", "light");
  //   }

  //   if (metaThemeColor) {
  //     const computed = getComputedStyle(root);
  //     const bgColor = computed.getPropertyValue("--bg-2").trim();
  //     metaThemeColor.setAttribute("content", bgColor);
  //   }
  // }, [isDarkMode]);

  useEffect(() => {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (isDarkMode) {
      root.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }

    if (metaThemeColor) {
      const computed = getComputedStyle(root);
      const bgColor = computed.getPropertyValue("--bg-2").trim();

      const clone = metaThemeColor.cloneNode();
      clone.setAttribute("content", bgColor);
      document.head.replaceChild(clone, metaThemeColor);
    }
  }, [isDarkMode]);

  // toggle dark/light mode
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

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

        <Switch isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </Container>
    </Navbar>
  );
}
