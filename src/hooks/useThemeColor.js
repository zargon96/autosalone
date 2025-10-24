import { useEffect } from "react";

export default function useThemeColor(isDark) {
  useEffect(() => {
    const LIGHT = "#eef1f7";
    const DARK = "#0f141c";
    const color = isDark ? DARK : LIGHT;
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    const clone = meta.cloneNode();
    clone.setAttribute("content", color);
    meta.replaceWith(clone);
    setTimeout(() => {
      clone.setAttribute("content", color);
    }, 50);
  }, [isDark]);
}
