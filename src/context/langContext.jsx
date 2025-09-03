import { createContext, useContext, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";

import it from "../translations/it.json";
import en from "../translations/en.json";

const LangContext = createContext();
const translations = { it, en };

export function LangProvider({ children }) {
  const [lang, setLangState] = useState("it");

  const toggleLanguage = useCallback(
    () => setLangState((prev) => (prev === "it" ? "en" : "it")),
    []
  );

  const setLang = useCallback((newLang) => {
    if (translations[newLang]) setLangState(newLang);
  }, []);

  const value = useMemo(
    () => ({
      lang,
      toggleLanguage,
      setLang,
      t: translations[lang],
    }),
    [lang, toggleLanguage, setLang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

LangProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useLang() {
  return useContext(LangContext);
}
