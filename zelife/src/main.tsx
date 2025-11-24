import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./fonts.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.log("Offline ready");
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/zlife">
      <App />
    </BrowserRouter>
  </StrictMode>
);
