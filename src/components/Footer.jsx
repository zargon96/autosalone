import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import useLang from "../context/useLang";
import "../styles/footer.css";

export default function Footer() {
  const { t } = useLang();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer container">
      <div className="footer-icons">
        <a
          href="https://github.com/zargon96"
          target="_blank"
          rel="noopener noreferrer"
          className="github-icon"
          aria-label={t.footer.github_aria}
        >
          <FontAwesomeIcon icon={faGithub} size="2x" />
        </a>
        <a
          href="https://www.linkedin.com/in/marcocrucitti96/"
          target="_blank"
          rel="noopener noreferrer"
          className="linkedin-icon"
          aria-label={t.footer.linkedin_aria}
        >
          <FontAwesomeIcon icon={faLinkedin} size="2x" />
        </a>
      </div>

      <p className="footer-text text-color">
        © <time dateTime={String(currentYear)}>{currentYear}</time>{" "}
        {t.footer.brand}. {t.footer.text}
      </p>
    </footer>
  );
}
