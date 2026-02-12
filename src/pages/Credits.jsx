import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCanvas } from "../context/CanvasContext";
import ButtonGlobal from "../components/ButtonGlobal";
import caretLeft from "../assets/caret-left-fill.svg";

const creditsData = [
  {
    title: "2003 Nissan 350Z Veliside Z33 Ver.III Body Kit",
    author: "Ddiaz Design",
    link: "https://skfb.ly/p8nNL",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "1987 Ferrari F40",
    author: "Ddiaz Design",
    link: "https://skfb.ly/ptzID",
    license: "Creative Commons Attribution",
    licenseLink: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: "1992 Lancia Delta HF Integrale Evoluzione",
    author: "Ddiaz Design",
    link: "https://skfb.ly/pCAGE",
    license: "Creative Commons Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "2015 Ferrari FXX K | www.vecarz.com",
    author: "vecarz",
    link: "https://skfb.ly/p8I9T",
    license: "CC Attribution",
    licenseLink: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: "2009 Pagani Zonda Cinque",
    author: "Ddiaz Design",
    link: "https://skfb.ly/pqZux",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "1975 Porsche 911 (930) Turbo",
    author: "Lexyc16",
    link: "https://skfb.ly/6TNLT",
    license: "CC Attribution",
    licenseLink: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: "2013 Ferrari F12 Berlinetta",
    author: "Ddiaz Design",
    link: "https://skfb.ly/prWKH",
    license: "Creative Commons Attribution",
    licenseLink: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: "2019 Ferrari 488 Pista",
    author: "Ddiaz Design",
    link: "https://skfb.ly/prvJS",
    license: "Creative Commons Attribution",
    licenseLink: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: "[FREE] BMW M3 E30",
    author: "Martin Trafas",
    link: "https://skfb.ly/oH7rM",
    license: "Creative Commons Attribution",
    licenseLink: "http://creativecommons.org/licenses/by/4.0/",
  },
  {
    title: "1969 Dodge Charger R/T",
    author: "OUTPISTON",
    link: "https://skfb.ly/pz7ZD",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "Toyota Supra (A80) 1993",
    author: "Lexyc16",
    link: "https://skfb.ly/oI6JB",
    license: "Creative Commons Attribution-NonCommercial",
    licenseLink: "http://creativecommons.org/licenses/by-nc/4.0/",
  },
  {
    title: "1997 Nissan Skyline GT-R V-Spec (R33)",
    author: "OUTPISTON",
    link: "https://skfb.ly/pyYpA",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "2002 Nissan Skyline GT-R V-Spec II Nür (R34)",
    author: "OUTPISTON",
    link: "https://skfb.ly/pzrno",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "2018 Honda S2000 Pandem Widebody Kit",
    author: "Ddiaz Design",
    link: "https://skfb.ly/ptQCV",
    license: "Creative Commons Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "2020 Honda NSX (NA1) LB★WORKS",
    author: "Ddiaz Design",
    link: "https://skfb.ly/pEKPv",
    license: "Creative Commons Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
  {
    title: "2023 BMW M2 G87 Coupé",
    author: "Ddiaz Design",
    link: "https://skfb.ly/psZpv",
    license: "Creative Commons Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
];

const Credits = () => {
  const { setMode } = useCanvas();

  useEffect(() => {
    document.body.classList.add("page-credits");
    return () => {
      document.body.classList.remove("page-credits");
    };
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark-mode"));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="container section-shadow p-4 rounded">
      <h1 className="text-center mb-4 text-color">Credits & Licenses</h1>
      <p className="text-center text-color">
        All 3D models used on this website belong to their respective authors
        and are subject to the following licenses.
      </p>

      <div className="row mt-4">
        {creditsData.map((item, i) => (
          <div key={i} className="col-6 col-lg-3 mb-4">
            <div className="p-3 bg-dark text-white rounded h-100 shadow-sm">
              <h5 className="mb-2">{item.title}</h5>
              <p className="mb-2">
                Created by:{" "}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-info"
                >
                  {item.author}
                </a>
              </p>
              <small>
                License:{" "}
                <a
                  href={item.licenseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warning"
                >
                  {item.license}
                </a>
              </small>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link to="/" style={{ textDecoration: "none" }}>
          <ButtonGlobal
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <img
              src={caretLeft}
              alt="Back to Home"
              className="icon-static me-2"
            />
            Back to Home
          </ButtonGlobal>
        </Link>
      </div>
    </div>
  );
};

export default Credits;
