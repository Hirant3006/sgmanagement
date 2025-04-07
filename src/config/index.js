const config = {
    apiUrl: import.meta.env.VITE_API_URL,
    appEnv: import.meta.env.VITE_APP_ENV,
    appTitle: import.meta.env.VITE_APP_TITLE,
    isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
    isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

export default config; 