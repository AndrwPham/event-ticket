import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { registerLicense } from "@syncfusion/ej2-base";
const syncfusionLicenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;
console.log("My Syncfusion License Key is:", syncfusionLicenseKey);
if (syncfusionLicenseKey) {
    registerLicense(syncfusionLicenseKey);
} else {
    console.warn(
        "Syncfusion license key not found. Please check your .env file.",
    );
}

const rootElement = document.getElementById("root");

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    );
} else {
    console.error("Root element not found.");
}
