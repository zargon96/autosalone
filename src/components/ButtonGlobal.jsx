import PropTypes from "prop-types";
import styled from "styled-components";

export default function ButtonGlobal({ onClick, disabled, children }) {
  return (
    <StyledWrapper>
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
};

const StyledWrapper = styled.div`
  button {
    align-items: center;
    background-image: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
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
    background-color: rgb(5, 6, 45);
    padding: 10px 16px;
    border-radius: 6px;
    transition: 300ms;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-size: 14px;
  }

  button:hover span {
    background: none;
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
