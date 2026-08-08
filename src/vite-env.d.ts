/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the ШартномаЁр backend API. Empty string = mock/local mode. */
  readonly VITE_API_URL?: string
  /** Enable verbose API client logging in the browser console. */
  readonly VITE_API_DEBUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
