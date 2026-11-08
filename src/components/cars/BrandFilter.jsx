import { useCallback, useEffect, useRef, cloneElement } from "react";
import { createPortal } from "react-dom";
import { Offcanvas } from "bootstrap";
import { cars } from "./carsData.js";
import { useCanvas } from "../../context/CanvasContext.jsx";
import "../../styles/brandFilter.css";
import { useLang } from "../../context/langContext.jsx";

// eslint-disable-next-line react-refresh/only-export-components
export const allBrands = [
  ...new Set(Object.values(cars).map((car) => car.name.split(" ")[0])),
].sort();

export default function BrandFilter({ trigger }) {
  const { activeCarId, selectedBrands, setSelectedBrands } = useCanvas();
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
          style={{
            "--filter-accent":
              cars[activeCarId]?.pillarColors?.top ?? "#8b5cf6",
          }}
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

            <div className="container-fluid brand-filter-grid">
              <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                {allBrands.map((brand) => {
                  const brandCars = Object.values(cars).filter(
                    (car) => car.name.split(" ")[0] === brand,
                  );
                  const count = brandCars.length;
                  const logo = brandCars[0]?.logo;
                  const isSelected = selectedBrands.includes(brand);

                  return (
                    <div key={brand} className="col">
                      <label
                        className={`brand-card${isSelected ? " is-selected" : ""}`}
                      >
                        <input
                          type="checkbox"
                          className="brand-card-checkbox"
                          checked={isSelected}
                          onChange={() => toggleBrand(brand)}
                        />
                        <span className="brand-card-logo">
                          <img
                            src={logo}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                        </span>
                        <span className="brand-card-name">{brand}</span>
                        <span className="brand-card-count">{count}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
