import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { registerLicense } from "@syncfusion/ej2-base";
const syncfusionLicenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;

registerLicense(syncfusionLicenseKey);

const rootElement = document.getElementById("root");

if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <AuthProvider>
                <App />
            </AuthProvider>
        </React.StrictMode>,
    );
} else {
    console.error("Root element not found.");
}
