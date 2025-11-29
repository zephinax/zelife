import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { StrictMode } from "react";
import { ServiceWorkerProvider } from "./providers/ServiceWorkerProvider";

const basename = "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <ServiceWorkerProvider>
        <App />
      </ServiceWorkerProvider>
    </BrowserRouter>
  </StrictMode>
);
