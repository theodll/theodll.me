import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    preprocess: vitePreprocess(),

    kit: {
        adapter: adapter({
            config: undefined,
            platformProxy: {
                configPath: undefined,
                environment: undefined,
                persist: undefined
            },
            // Die Option 'fallback' wurde entfernt, um Assets korrekt zu integrieren.
            routes: {
                include: ['/*'],
                exclude: ['<all>']
            }
        })
    }
};

export default config;