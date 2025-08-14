import { useContext } from "react";
import { LangContext } from "./langContext";

export default function useLang() {
  return useContext(LangContext);
}
