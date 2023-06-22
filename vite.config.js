import { defineConfig } from 'vite';

const config = () => {
    return defineConfig({
        base: '/street-fighter',

        server: {
            host: 'localhost',
            port: 8000
        }
    });
};

export default config;
