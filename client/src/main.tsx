import App from "./App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// import { ThemeProvider } from '@gravity-ui/uikit';
import '@gravity-ui/uikit/styles/fonts.css';
import '@gravity-ui/uikit/styles/styles.css';
import "./index.css";
// import LandingPage from "./LandingPage";
// import NavBar from "./NavBar"
// import Footer from "./Footer";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App /> 
  </StrictMode>,
);
