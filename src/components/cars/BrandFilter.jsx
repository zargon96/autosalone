import { useCallback, useEffect, useRef, cloneElement } from "react";
import { createPortal } from "react-dom";
import { Offcanvas } from "bootstrap";
import { cars } from "./carsData.js";
import { useCanvas } from "../../context/CanvasContext.jsx";
import "../../styles/brandFilter.css";
import { useLang } from "../../context/langContext.jsx";

export const allBrands = [
  ...new Set(Object.values(cars).map((car) => car.name.split(" ")[0])),
].sort();

export default function BrandFilter({ trigger }) {
  const { selectedBrands, setSelectedBrands } = useCanvas();
  const { t } = useLang();
  const offcanvasRef = useRef(null);
  const bsOffcanvasRef = useRef(null);

  useEffect(() => {
    if (offcanvasRef.current) {
      bsOffcanvasRef.current = new Offcanvas(offcanvasRef.current);
    }
    return () => bsOffcanvasRef.current?.dispose();
  }, []);

  const toggleBrand = useCallback(
    (brand) => {
      setSelectedBrands(
        selectedBrands.includes(brand)
          ? selectedBrands.filter((b) => b !== brand)
          : [...selectedBrands, brand],
      );
    },
    [selectedBrands, setSelectedBrands],
  );

  const resetFilter = useCallback(
    () => setSelectedBrands(allBrands),
    [setSelectedBrands],
  );

  const isFiltered = selectedBrands.length < allBrands.length;

  return (
    <>
      {cloneElement(trigger, {
        onClick: () => bsOffcanvasRef.current?.show(),
      })}

      {createPortal(
        <div
          ref={offcanvasRef}
          className="offcanvas offcanvas-end brand-filter-offcanvas"
          tabIndex="-1"
          aria-labelledby="brandFilterLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="brandFilterLabel">
              {t.filter.title}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => bsOffcanvasRef.current?.hide()}
              aria-label="Chiudi"
            />
          </div>

          <div className="offcanvas-body">
            {isFiltered && (
              <div className="filter-actions mb-3">
                <button
                  className="btn btn-sm filter-action-btn"
                  onClick={resetFilter}
                >
                  {t.filter.reset}
                </button>
              </div>
            )}

            <div className="brand-list">
              {allBrands.map((brand) => {
                const count = Object.values(cars).filter(
                  (c) => c.name.split(" ")[0] === brand,
                ).length;

                return (
                  <label key={brand} className="brand-item">
                    <input
                      type="checkbox"
                      className="brand-checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    <span className="brand-name">{brand}</span>
                    <span className="brand-count">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
