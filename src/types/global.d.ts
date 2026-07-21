export {};

declare global {
  interface Window {
    editorTools: {
      enable: () => void;
      disable?: () => void;
    };
  }
}