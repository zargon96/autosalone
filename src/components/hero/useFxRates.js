import { useEffect, useState } from "react";

let cachedRates = null;

export default function useFxRates() {
  const [rates, setRates] = useState(cachedRates);

  useEffect(() => {
    if (cachedRates) return;

    const cacheKey = import.meta.env.VITE_FX_CACHE_KEY;
    const apiBase = import.meta.env.VITE_FX_API_BASE;
    const url = `${apiBase}/latest?base=EUR&symbols=GBP`;

    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const obj = JSON.parse(cached);
        if (Date.now() - obj.ts < 60 * 60 * 1000) {
          cachedRates = obj.data;
          setRates(obj.data);
          return;
        }
      }
    } catch (err) {
      console.warn("[FX] Cache read error:", err);
    }

    (async () => {
      try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        cachedRates = data;
        setRates(data);

        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ ts: Date.now(), data })
          );
        } catch (err) {
          console.warn("[FX] Cache write error:", err);
        }
      } catch (err) {
        console.warn("[FX] Fetch failed:", err);

        try {
          const stale = localStorage.getItem(cacheKey);
          if (stale) {
            const obj = JSON.parse(stale);
            if (obj?.data) {
              cachedRates = obj.data;
              setRates(obj.data);
            }
          }
        } catch (err) {
          console.warn("[FX] Failed to load stale cache:", err);
        }
      }
    })();
  }, []);

  return rates;
}
