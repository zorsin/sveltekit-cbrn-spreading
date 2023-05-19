import precompileIntl from 'svelte-intl-precompile/sveltekit-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

import path from 'path';
/** @type {import('vite').UserConfig} */
const config = {
  plugins: [basicSsl(), precompileIntl('locales', '$locales'), sveltekit()],
  resolve: {
    alias: {
      $types: path.resolve('src/lib/types/'),
    },
  },
};

export default config;
