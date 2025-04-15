import React from "react";
import ReactDOM from "react-dom/client"; // Utilisation de createRoot
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root")); // Créer la root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();