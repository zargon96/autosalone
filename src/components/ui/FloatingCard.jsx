import { useState } from "react";
import { useLang } from "../../context/langContext";

export default function FloatingCard({ title, text, onClose }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLang();

  const isLong = text && text.length > 180;

  return (
    <div className="floating-card">
      <div className="floating-card-content">
        <h3>{title}</h3>

        <p className={`card-text ${expanded ? "expanded" : ""}`}>{text}</p>

        {isLong && (
          <button
            className="read-more"
            onClick={() => setExpanded((prev) => !prev)}
          >
            {expanded ? t.experience?.readLess : t.experience?.readMore}
          </button>
        )}

        <button className="floating-close" onClick={onClose}>
          {t.experience?.close}
        </button>
      </div>
    </div>
  );
}
