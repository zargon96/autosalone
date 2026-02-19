import PropTypes from "prop-types";
import "../styles/mobilebottomsheet.css";

export default function MobileBottomSheet({ title, text, onClose }) {
  return (
    <div className="mobile-sheet">
      <div className="mobile-sheet-header">
        <button className="mobile-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <h3 className="mobile-sheet-title">{title}</h3>
      <p className="mobile-sheet-text">{text}</p>
    </div>
  );
}

MobileBottomSheet.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  onClose: PropTypes.func,
};
