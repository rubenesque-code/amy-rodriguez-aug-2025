import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			'^actions': 'src/lib/actions',

			'^assets': 'src/lib/assets',

			'^components': 'src/lib/components',

			'^config': 'src/lib/config',

			'^constants': 'src/lib/constants',

			'^content': 'src/lib/content',

			'^data': 'src/lib/data',

			'^data-processing': 'src/lib/data-processing',

			'^db': 'src/lib/db',

			'^files': 'src/lib/assets/_files',

			'^helpers': 'src/lib/helpers',

			'^hooks': 'src/lib/hooks',

			'^lib': 'src/lib',

			'^pages/*': 'src/lib/components/~pages/*',

			'^pages': 'src/lib/components/~pages',

			'^sections': 'src/lib/~sections',

			'^services': 'src/lib/services',

			'^shopify': 'src/lib/shopify',

			'^stores': 'src/lib/stores',

			'^structured-data-parts': 'src/lib/structured-data-parts',

			'^types': 'src/lib/types',

			'^utils': 'src/lib/utils'
		}
	}
};

export default config;
