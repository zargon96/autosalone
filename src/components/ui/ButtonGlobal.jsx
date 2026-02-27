import PropTypes from "prop-types";
import styled from "styled-components";
import { FLAG_ITALY, FLAG_JAPAN } from "../cars/carsData";

const INVERT_FLAGS = [JSON.stringify(FLAG_ITALY), JSON.stringify(FLAG_JAPAN)];

export default function ButtonGlobal({
  onClick,
  disabled,
  children,
  className,
  pillarColors,
}) {
  const gradientColors = pillarColors
    ? [
        pillarColors.top,
        pillarColors.middle || pillarColors.top,
        pillarColors.bottom,
      ].filter(Boolean)
    : ["#af40ff", "#5b42f3", "#00ddeb"];

  const gradient = `linear-gradient(144deg, ${gradientColors.join(", ")})`;
  const shadow = `${gradientColors[0]}33 0 8px 20px -5px`;
  const shouldInvert = pillarColors
    ? INVERT_FLAGS.includes(JSON.stringify(pillarColors))
    : false;
  return (
    <StyledWrapper
      className={className}
      $gradient={gradient}
      $shadow={shadow}
      $invertIcon={shouldInvert}
    >
      <button onClick={onClick} disabled={disabled}>
        <span className="text">{children}</span>
      </button>
    </StyledWrapper>
  );
}

ButtonGlobal.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  pillarColors: PropTypes.shape({
    top: PropTypes.string,
    middle: PropTypes.string,
    bottom: PropTypes.string,
  }),
};

const StyledWrapper = styled.div`
  button {
    align-items: center;
    background-image: ${({ $gradient }) => $gradient};
    border: 0;
    border-radius: 8px;
    box-shadow: rgba(151, 65, 252, 0.2) 0 8px 20px -5px;
    color: #ffffff;
    display: inline-flex;
    font-size: 16px;
    justify-content: center;
    line-height: 1em;
    padding: 2px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button:active,
  button:hover {
    outline: 0;
  }

  button span {
    background-color: #000;
    padding: 16px 20px;
    border-radius: 6px;
    transition: 300ms;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
    color: #ffffff;
  }

  button:hover span {
    background: none;
    color: ${({ $invertIcon }) => ($invertIcon ? "#000000" : "#ffffff")};
  }

  button span img {
    filter: invert(1);
  }

  button:hover span img {
    filter: ${({ $invertIcon }) => ($invertIcon ? "invert(0)" : "invert(1)")};
  }

  button:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    button {
      font-size: 14px;
    }

    button span {
      padding: 8px 12px;
      font-size: 13px;
      gap: 6px;
    }
  }
`;
