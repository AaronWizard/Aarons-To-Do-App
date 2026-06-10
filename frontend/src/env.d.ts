interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_API_TIMEOUT_MS: number;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
