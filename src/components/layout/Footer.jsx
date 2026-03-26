import { Link } from "react-router-dom";
import { useLang } from "../../context/langContext.jsx";
import "../../styles/footer.css";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer container">
      <p className="footer-text text-color">
        © <time dateTime="2025-2026">2025–2026</time> {t.footer.brand}.{" "}
        {t.footer.text}
      </p>
      <p className="footer-text credits">
        <Link to="/credits" className="text-color">
          Credits & Licenses
        </Link>
      </p>
    </footer>
  );
}
