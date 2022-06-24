import adapter from './src/adapter/adapter.js';
import preprocess from 'svelte-preprocess';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import fs from 'fs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: preprocess(),

  kit: {
    adapter: adapter(),
    vite: {
      server: {
        https: {
          key: fs.readFileSync('./config/server.key'),
          cert: fs.readFileSync('./config/server.crt'),
        },
      },
      plugins: [precompileIntl('locales')],
    },
  },
};

export default config;
