import { StrictMode } from "react";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Credits from "./pages/Credits";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
