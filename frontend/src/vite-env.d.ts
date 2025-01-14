/// <reference types="vite/client" />
interface PyWebView {
    state: Record<string, any>;
    api: any;
    // Add other pywebview properties/methods as needed
}

declare global {
    interface Window {
        pywebview?: PyWebView;
    }
}

export {};