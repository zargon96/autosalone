import { useLang } from "../../context/langContext.jsx";
import { Navbar, Container } from "react-bootstrap";
import { useCanvas } from "../../context/CanvasContext";
import { cars, FLAG_ITALY, FLAG_JAPAN } from "../cars/carsData";
import BrandFilter, { allBrands } from "../cars/BrandFilter.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const INVERT_FLAGS = [JSON.stringify(FLAG_ITALY), JSON.stringify(FLAG_JAPAN)];

export default function NavigationBar() {
  const { lang, setLang } = useLang();
  const { activeCarId, selectedBrands } = useCanvas();

  const pillarColors = activeCarId ? cars[activeCarId]?.pillarColors : null;

  const gradientColors = pillarColors
    ? [
        pillarColors.top,
        pillarColors.middle || pillarColors.top,
        pillarColors.bottom,
      ].filter(Boolean)
    : ["#af40ff", "#5b42f3", "#00ddeb"];

  const gradient = `linear-gradient(144deg, ${gradientColors.join(", ")})`;

  const shouldInvert = pillarColors
    ? INVERT_FLAGS.includes(JSON.stringify(pillarColors))
    : false;

  const isFiltered = selectedBrands.length < allBrands.length;

  return (
    <Navbar variant="dark" expand="lg" className="pt-4 mb-5">
      <Container>
        <div className="lang-switch">
          <LangButton
            type="button"
            onClick={() => setLang("it")}
            aria-label="Cambia lingua in Italiano"
            $gradient={gradient}
            $active={lang === "it"}
            $invertText={shouldInvert}
          >
            <span className="navbar-button-content">IT</span>
          </LangButton>
          <span className="mx-2 text-color">|</span>
          <LangButton
            type="button"
            onClick={() => setLang("en")}
            aria-label="Switch language to English"
            $gradient={gradient}
            $active={lang === "en"}
            $invertText={shouldInvert}
          >
            <span className="navbar-button-content">EN</span>
          </LangButton>
        </div>

        <div className="ms-auto">
          <BrandFilter
            trigger={
              <FilterButton
                type="button"
                $gradient={gradient}
                $shadow={`${gradientColors[0]}33 0 8px 20px -5px`}
                $invertText={shouldInvert}
                aria-label="Apri filtri auto"
              >
                <span className="navbar-button-content">
                  <FontAwesomeIcon icon={faSlidersH} />
                  {isFiltered && (
                    <span className="filter-badge">{selectedBrands.length}</span>
                  )}
                </span>
              </FilterButton>
            }
          />
        </div>
      </Container>
    </Navbar>
  );
}

const LangButton = styled.button`
  --button-bg: #000;
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: ${({ $active, $gradient }) =>
    $active ? $gradient : "transparent"};
  border: none;
  cursor: pointer;
  color: var(--text-color);
  font-weight: 700;
  font-size: 1rem;
  padding: ${({ $active }) => ($active ? "2px" : "0.35rem 0.55rem")};
  border-radius: 8px;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;

  .navbar-button-content {
    position: relative;
    display: inline-flex;
    min-width: ${({ $active }) => ($active ? "2.4rem" : "auto")};
    min-height: ${({ $active }) => ($active ? "2rem" : "auto")};
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: ${({ $active }) => ($active ? "0.4rem 0.65rem" : "0")};
    border-radius: 6px;
    background: ${({ $active }) =>
      $active ? "var(--button-bg)" : "transparent"};
    transition:
      background 0.25s ease,
      color 0.25s ease;
  }

  &:hover {
    transform: translateY(-1px);
  }

  &:hover .navbar-button-content {
    background: transparent;
    color: ${({ $active, $invertText }) =>
      $active && $invertText ? "#000" : "#fff"};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;

const FilterButton = styled.button`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 0;
  border-radius: 8px;
  background: ${({ $gradient }) => $gradient};
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.25s ease;

  .navbar-button-content {
    position: relative;
    display: inline-flex;
    min-width: 2.4rem;
    min-height: 2rem;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.4rem 0.65rem;
    border-radius: 6px;
    background: #000;
    transition:
      background 0.25s ease,
      color 0.25s ease;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $shadow }) => $shadow};
  }

  &:hover .navbar-button-content {
    background: transparent;
    color: ${({ $invertText }) => ($invertText ? "#000" : "#fff")};
  }

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 3px;
  }
`;
