import PropTypes from "prop-types";
import { useState, useMemo } from "react";
import { LangContext } from "./langContext";

import it from "../translations/it.json";
import en from "../translations/en.json";

const translations = {
  it,
  en,
};

export const LangProvider = ({ children }) => {
  const [lang, setLang] = useState("it");

  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === "it" ? "en" : "it"));
  };

  const setSpecificLanguage = (lang) => {
    setLang(lang);
  };

  const value = useMemo(
    () => ({
      lang,
      toggleLanguage,
      setLang: setSpecificLanguage,
      t: translations[lang],
    }),
    [lang]
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
};

LangProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
