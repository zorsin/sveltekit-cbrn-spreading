// import install from '@twind/with-sveltekit';
// import twindConfig from '$lib/twind.config';
import { init, waitLocale, getLocaleFromNavigator } from 'svelte-intl-precompile';

import { registerAll } from '$locales';

// install(twindConfig);
registerAll();

export const load = async () => {
  init({
    fallbackLocale: 'de', // TODO: change to en
    initialLocale: getLocaleFromNavigator(),
  });
  await waitLocale(); // awaits for initialLocale language pack to finish loading;
  return {};
};
