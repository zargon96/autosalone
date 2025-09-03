import { useEffect, useState } from "react";

let cachedRates = null;
let inFlight = null;

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

    if (inFlight) {
      inFlight.then(setRates).catch(() => {});
      return;
    }

    inFlight = fetch(url, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
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
        return data;
      })
      .catch((err) => {
        console.warn("[FX] Fetch failed:", err);
        try {
          const stale = localStorage.getItem(cacheKey);
          if (stale) {
            const obj = JSON.parse(stale);
            if (obj?.data) {
              cachedRates = obj.data;
              setRates(obj.data);
              return obj.data;
            }
          }
        } catch (err) {
          console.warn("[FX] Failed to load stale cache:", err);
        }
        return null;
      })
      .finally(() => {
        inFlight = null;
      });
  }, []);

  return rates;
}
