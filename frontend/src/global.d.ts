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
