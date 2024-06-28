import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CrosswordRoutes } from "./CrosswordRoutes";
import "chota";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CrosswordRoutes />
    </BrowserRouter>
  </React.StrictMode>
);
