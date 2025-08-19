import { Link } from "react-router-dom";
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
    title: "2009 Pagani Zonda Cinque",
    author: "Ddiaz Design",
    link: "https://skfb.ly/pqZux",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
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
    title: "2020 Audi TT RS Coupe",
    author: "Ddiaz Design",
    link: "https://skfb.ly/ptYFU",
    license: "CC Attribution-NonCommercial-ShareAlike",
    licenseLink: "http://creativecommons.org/licenses/by-nc-sa/4.0/",
  },
];

const Credits = () => {
  return (
    <div className="container mt-5 section-shadow p-4 rounded">
      <h1 className="text-center mb-4 text-white">Credits & Licenses</h1>
      <p className="text-center text-white">
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
        <Link to="/" className="btn btn-outline-light">
          ⬅ Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Credits;
