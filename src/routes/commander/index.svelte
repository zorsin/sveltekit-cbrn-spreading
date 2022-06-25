<script lang="ts">
  import { PageTitle, Button, Dialog, TextField } from '$lib/smelte';
  import { navigating } from '$app/stores';
  import { goto, prefetch } from '$app/navigation';
  import { t } from 'svelte-intl-precompile';

  export let recentSpreads;
  export let mission;

  let showDialog = false;
  let inputValue = '';

  const closeDialog = () => {
    showDialog = false;
    inputValue = '';
  };

  const prefetchSpread = () => {
    prefetch(`/commander/${inputValue}`);
  };
  const gotoSpread = async () => {
    goto(`/commander/${inputValue}`);
  };

  let loading = false;
  $: loading = !!$navigating;
</script>

<PageTitle>{$t('pages.commander.title')}</PageTitle>
<span>{$t('pages.commander.descr')}</span>
<div class="grid(& cols-1) mt-8 gap-4 md:flex">
  <Button href={`/commander/create`} replace={{ 'w-max': 'w-full md:w-max' }}
    >{$t('pages.commander.btn-create')}</Button
  >
  <Button on:click={() => (showDialog = true)} replace={{ 'w-max': 'w-full md:w-max' }}
    >{$t('pages.commander.btn-view')}</Button
  >
</div>
<div class="grid(& cols-1 md:cols-2) gap-4 mt-16 ">
  {#if recentSpreads.length > 0}
    <div>
      <h4 class="text-lg mb-4">{$t('pages.commander.recent-spreads')}</h4>
      <ul>
        {#each recentSpreads as spread}
          <li>
            <a class="text-base" href="/commander/{spread.id}" sveltekit:prefetch>
              {spread.name}
              <small class="text-sm text-gray-500">({spread.id})</small>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  {#if mission}
    <div>
      <h4 class="text-lg mb-4">{$t('pages.commander.mission')}</h4>
      <a class="text-base" href="/commander/mission/{mission.uuid}" sveltekit:prefetch>
        {mission.code}
        <small class="text-sm text-gray-500">({mission.uuid})</small>
      </a>
    </div>
  {/if}
</div>

<Dialog bind:value={showDialog} persistent progresscolor="white" {loading}>
  <h5 slot="title">{$t('pages.commander.dialog.title')}</h5>
  <div>{$t('pages.commander.dialog.descr')}</div>
  <TextField label={$t('pages.commander.dialog.label-input')} bind:value={inputValue} />
  <div slot="actions">
    <Button on:click={closeDialog}>{$t('common.back')}</Button>
    <Button on:click={() => gotoSpread()} on:mouseover={prefetchSpread}>{$t('common.next')}</Button>
  </div>
</Dialog>
