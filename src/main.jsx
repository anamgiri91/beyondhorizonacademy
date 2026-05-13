import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/base.css";
import "./styles/header.css";
import "./styles/pages.css";
import "./styles/cards.css";
import "./styles/course-detail.css";
import "./styles/interactive.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
