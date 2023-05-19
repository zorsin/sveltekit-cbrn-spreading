<script lang="ts">
  import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
  import '@skeletonlabs/skeleton/styles/skeleton.css';
  import '../app.postcss';
  import Geolocation from 'svelte-geolocation';
  import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
  import { page } from '$app/stores';
  import { t } from 'svelte-intl-precompile';
  import { AppShell, AppBar, AppRail, AppRailTile, Modal, Toast, Drawer, drawerStore } from '@skeletonlabs/skeleton';
  import { writable, type Writable } from 'svelte/store';
  import { Bar3 } from '$lib/heroicons';
  import { Switch } from '$lib/skeleton';
  import { setContext } from 'svelte';
  import type { UnitMissionSettings } from '$types/Context';
  import XMark from '$lib/heroicons/XMark.svelte';

  const selected: Writable<string> = writable($page.url.pathname);
  $: $selected = $page.url.pathname;

  const openNavigation = () => {
    drawerStore.open({ id: 'navigation', width: 'w-1/3' });
  };
  const enableGPS = writable(false);
  const enableMeasure = writable(false);
  const coords = writable<GeolocationCoords>([0, 0]);
  setContext<UnitMissionSettings>('UNIT_MISSION_SETTINGS', {
    enableGPS,
    enableMeasure,
    coords,
  });
</script>

<svelte:head>
  <title>{$t('title')}</title>
</svelte:head>
<Geolocation getPosition={$enableGPS} watch={true} bind:coords={$coords} />
<Modal />
<Toast />
<Drawer>
  {#if $drawerStore.id === 'navigation'}
    <AppRail {selected} width="w-full">
      <AppRailTile label={$t('pages.landing.navTitle')} tag="a" href="/" value="/" on:click={() => drawerStore.close()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      </AppRailTile>
      <AppRailTile label={$t('pages.commander.title')} tag="a" href="/commander" value="/commander" on:click={() => drawerStore.close()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      </AppRailTile>
      <AppRailTile label={$t('pages.unit.title')} tag="a" href="/unit" value="/unit" on:click={() => drawerStore.close()}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      </AppRailTile>
    </AppRail>
  {:else if $drawerStore.id === 'unit-mission-settings'}
    <div class="grid p-4 gap-5">
      <h3 class="h3 col-span-12 flex justify-between">
        {$t('pages.unit-mission.labels.settings')} <button on:click={() => drawerStore.close()}><XMark class="w-6 h-6" /></button>
      </h3>
      <Switch class="col-span-12" name="enableGPS" bind:checked={$enableGPS}>{$t('pages.unit-mission.labels.gps')}</Switch>
      <Switch class="col-span-12" name="enableMeasure" bind:checked={$enableMeasure}>{$t('pages.unit-mission.labels.start')}</Switch>
    </div>
  {/if}
</Drawer>
<AppShell>
  <AppRail slot="sidebarLeft" {selected} class="hidden md:block">
    <AppRailTile label={$t('pages.landing.navTitle')} tag="a" href="/" value="/">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    </AppRailTile>
    <AppRailTile label={$t('pages.commander.title')} tag="a" href="/commander" value="/commander">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    </AppRailTile>
    <AppRailTile label={$t('pages.unit.title')} tag="a" href="/unit" value="/unit">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    </AppRailTile>
  </AppRail>
  <AppBar slot="header">
    <div slot="lead" class="flex gap-4">
      <button class="w-8 h-8 block md:hidden" on:click={openNavigation}><Bar3 /></button>
      <img src="/diamond.png" alt="CBRN Logo" class="w-8" />
    </div>
    {$t('title')}
  </AppBar>
  <!-- Router Slot -->
  <slot />
  <!-- ---- / ---- -->
</AppShell>
