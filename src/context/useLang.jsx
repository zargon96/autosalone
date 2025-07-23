import { useContext } from "react";
import { LangContext } from "./langContext";

const useLang = () => useContext(LangContext);

export default useLang;
