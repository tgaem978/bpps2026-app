/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string;
  readonly VITE_PROJECT_ID?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
