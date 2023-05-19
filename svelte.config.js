import preprocess from 'svelte-preprocess';

import adapter from './src/adapter/adapter.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
  preprocess: [
    preprocess({
      postcss: true,
    }),
  ],

  kit: {
    adapter: adapter(),
    alias: {
      $types: 'src/lib/types/',
    },
  },
};

export default config;
