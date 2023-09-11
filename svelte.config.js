import adapter from '@sveltejs/adapter-static';
import {
    vitePreprocess
} from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'docs',
			assets: 'docs', fallback: null
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/smoke-us-test' : '',
		}, 

	}
};

export default config;
