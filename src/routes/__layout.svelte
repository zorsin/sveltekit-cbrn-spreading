<script context="module">
  import install from '@twind/with-sveltekit';
  import twindConfig from '$lib/twind.config';
  import { init, waitLocale, getLocaleFromNavigator } from 'svelte-intl-precompile';
  import { registerAll } from '$locales';

  install(twindConfig);
  registerAll();

  export const load = async ({ session }) => {
    init({
      fallbackLocale: 'en',
      initialLocale: session.acceptedLanguage || getLocaleFromNavigator(),
    });
    await waitLocale(); // awaits for initialLocale language pack to finish loading;
    return {};
  };
</script>

<script lang="ts">
  import { Tabs, AppBar, Spacer, Notifications } from '$lib/smelte';
  import { page } from '$app/stores';
  import { t } from 'svelte-intl-precompile';

  const topMenu = [
    { to: '/commander', text: $t('pages.commander.title') },
    { to: '/unit', text: $t('pages.unit.title') },
  ];

  $: selected = $page.url.pathname;
</script>

<AppBar>
  <a href="/" class="px-2 md:px-8 flex items-center">
    <img src="/diamond.png" alt="CBRN Logo" width="44" />
    <h6 class="pl-3 text-white tracking-widest font-thin text-lg">{$t('title')}</h6>
  </a>
  <Tabs navigation items={topMenu} {selected} tabButtonClasses="!text-lg" />
  <Spacer />
</AppBar>

<main class="relative p-8 mx-auto mb-10 mt-24">
  <slot />
</main>
<Notifications />
