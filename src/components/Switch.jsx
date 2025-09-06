import PropTypes from "prop-types";
import styled from "styled-components";

const Switch = ({ isDarkMode, toggleTheme }) => {
  return (
    <StyledWrapper>
      <label className="switch">
        <input
          type="checkbox"
          aria-checked={isDarkMode}
          checked={isDarkMode}
          onChange={toggleTheme}
          aria-label="Toggle dark mode"
        />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

Switch.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

const StyledWrapper = styled.div`
  .switch {
    display: block;
    --width-of-switch: 3.5em;
    --height-of-switch: 2em;
    --size-of-icon: 1.4em;
    --slider-offset: 0.3em;
    position: relative;
    width: var(--width-of-switch);
    height: var(--height-of-switch);
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* Base (quando è light mode → tasto scuro) */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #303136; /* scuro */
    transition: 0.4s;
    border-radius: 30px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: var(--size-of-icon, 1.4em);
    width: var(--size-of-icon, 1.4em);
    border-radius: 20px;
    left: var(--slider-offset, 0.3em);
    top: 50%;
    transform: translateY(-50%);
    background: #303136; /* luna (scura) */
    box-shadow: inset -3px -2px 5px -2px #8983f7, inset -10px -4px 0 0 #a3dafb;
    transition: 0.4s;
  }

  /* Quando è dark mode → switch chiaro */
  input:checked + .slider {
    background-color: #f4f4f5; /* chiaro */
  }

  input:checked + .slider:before {
    left: calc(
      100% - (var(--size-of-icon, 1.4em) + var(--slider-offset, 0.3em))
    );
    background: linear-gradient(40deg, #ff0080, #ff8c00 70%); /* sole */
    box-shadow: none;
  }
`;

export default Switch;
