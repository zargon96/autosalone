import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";

import it from "../translations/it.json";
import en from "../translations/en.json";

const LangContext = createContext();

// available translations
const translations = { it, en };

export function LangProvider({ children }) {
  // current language state
  const [lang, setLangState] = useState("it");

  // toggle between it and en
  const toggleLanguage = useCallback(
    () => setLangState((prev) => (prev === "it" ? "en" : "it")),
    []
  );

  // set language explicitly if available
  const setLang = useCallback((newLang) => {
    if (translations[newLang]) setLangState(newLang);
  }, []);

  // memoize context value to avoid unnecessary renders
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

// custom hook to consume lang context
export function useLang() {
  return useContext(LangContext);
}
