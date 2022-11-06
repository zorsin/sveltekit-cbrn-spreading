import path from 'path';
import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [precompileIntl('locales', '$locales'), sveltekit()],
  resolve: {
    alias: {
      $types: path.resolve('src/lib/types/'),
    },
  },
};

export default config;
