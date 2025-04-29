/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_GOOGLE_MAPS_API_KEY: string;
    readonly VITE_DRIVER_ID: string;
    // add any other VITE_ vars you’re using here…
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  