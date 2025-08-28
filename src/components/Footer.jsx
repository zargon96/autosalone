import { Link } from "react-router-dom";
import useLang from "../context/useLang";
import "../styles/footer.css";

export default function Footer() {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer container">
      <p className="footer-text text-color">
        © <time dateTime={String(currentYear)}>{currentYear}</time>{" "}
        {t.footer.brand}. {t.footer.text}
      </p>
      <p className="footer-text credits">
        <Link to="/credits" className="text-color">
          Credits & Licenses
        </Link>
      </p>
    </footer>
  );
}
