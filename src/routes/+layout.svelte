<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  import '@skeletonlabs/skeleton/styles/all.css';
  import { Tabs, AppBar, Spacer, Notifications, Button, NavigationDrawer, List, ListItem } from '$lib/smelte';
  import { page } from '$app/stores';
  import { t } from 'svelte-intl-precompile';
  import { showNav } from '$lib/stores';

  const topMenu = [
    { to: '/commander', text: $t('pages.commander.title') },
    { to: '/unit', text: $t('pages.unit.title') },
  ];

  $: selected = $page.url.pathname;
</script>

<svelte:head>
  <title>{$t('title')}</title>
</svelte:head>
<AppBar>
  <a href="/" class="px-2 md:px-8 flex items-center">
    <img src="/diamond.png" alt="CBRN Logo" width="44" />
    <h6 class="pl-3 text-white tracking-widest font-thin text-lg">{$t('title')}</h6>
  </a>
  <Tabs navigation items={topMenu} {selected} tabButtonClasses="!text-lg" />
  <Spacer />
  <div class="md:hidden pr-4">
    <Button icon="menu" small flat remove="p-1 h-4 w-4" iconClass="text-white" text on:click={() => showNav.set(!$showNav)} />
  </div>
</AppBar>

<main class="relative p-8 mx-auto mb-10 mt-24">
  <NavigationDrawer bind:show={$showNav} right={true} persistent={false} elevation={true}>
    <h6 class="px-3 ml-1 pb-2 pt-8 mb-6 text-2xl text-gray-900 font-light dark:text-gray-100">Menu</h6>
    <List items={topMenu}>
      <span slot="item" let:item class="cursor-pointer">
        <a href={item.to}>
          <ListItem text={item.text} to={item.to} dense />
        </a>
      </span>
    </List>
  </NavigationDrawer>
  <slot />
</main>
<Notifications />
