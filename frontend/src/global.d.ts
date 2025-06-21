declare module "*.png";
declare module "*.jpg" {
    const value: string;
    export default value;
}
declare module "*.jpeg";
declare module "*.svg";

interface PayOSConfig {
    checkoutUrl: string;
    onSuccess: (data: unknown) => void;
    onExit: () => void;
}

interface PayOSCheckout {
    render(elementId: string, config: PayOSConfig): void;
}

interface Window {
    PayOSCheckout: PayOSCheckout;
}
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_SYNCFUSION_LICENSE_KEY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
