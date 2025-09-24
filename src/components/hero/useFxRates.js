import { useEffect, useState } from "react";

let cachedRates = null; // store cached rates in memory
let inFlight = null; // keep track of ongoing request

export default function useFxRates() {
  const [rates, setRates] = useState(cachedRates);

  useEffect(() => {
    // return early if already cached
    if (cachedRates) return;
    const cacheKey = import.meta.env.VITE_FX_CACHE_KEY;
    const apiBase = import.meta.env.VITE_FX_API_BASE;
    const url = `${apiBase}/latest?base=EUR&symbols=GBP`;

    // try to read from localstorage cache
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const obj = JSON.parse(cached);

        // cache is valid for 1 hour
        if (Date.now() - obj.ts < 60 * 60 * 1000) {
          cachedRates = obj.data;
          setRates(obj.data);
          return;
        }
      }
    } catch (err) {
      console.warn("[FX] Cache read error:", err);
    }

    // reuse in-flight request if one exists
    if (inFlight) {
      inFlight.then(setRates).catch(() => {});
      return;
    }

    // fetch fresh data
    inFlight = fetch(url, { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        cachedRates = data;
        setRates(data);

        // write to localstorage
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
        // fallback to stale cache if available
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
