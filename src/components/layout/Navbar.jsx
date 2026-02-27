import { useLang } from "../../context/langContext.jsx";
import { Navbar, Container } from "react-bootstrap";
import { useCanvas } from "../../context/CanvasContext";
import { cars, FLAG_ITALY, FLAG_JAPAN } from "../cars/carsData";
import styled from "styled-components";

const INVERT_FLAGS = [JSON.stringify(FLAG_ITALY), JSON.stringify(FLAG_JAPAN)];

export default function NavigationBar() {
  const { lang, setLang } = useLang();
  const { activeCarId } = useCanvas();

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
            IT
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
            EN
          </LangButton>
        </div>
      </Container>
    </Navbar>
  );
}

const LangButton = styled.button`
  background: ${({ $active, $gradient }) => ($active ? $gradient : "none")};
  border: none;
  cursor: pointer;
  color: ${({ $active, $invertText }) =>
    $active && $invertText ? "#000000" : "var(--text-color)"};
  font-weight: 700;
  border: 2px solid
    ${({ $active, $invertText }) =>
      $active ? ($invertText ? "#000000" : "#ffffff") : "transparent"};
  font-size: 1rem;
  padding: 2px 6px;
  border-radius: 8px;
  transition: all 0.3s ease;
`;
