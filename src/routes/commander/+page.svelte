<script lang="ts">
  import { navigating } from '$app/stores';
  import { t } from 'svelte-intl-precompile';
  import type { PageData } from './$types';
  import ContentGrid from '$lib/skeleton/ContentGrid.svelte';
  import { modalStore } from '@skeletonlabs/skeleton';
  import { goto } from '$app/navigation';
  import PageTitle from '$lib/skeleton/PageTitle.svelte';

  export let data: PageData;

  const { recentSpreads, mission } = data;

  let loading = false;
  $: loading = !!$navigating;

  const openModal = () => {
    modalStore.clear();
    modalStore.trigger({
      type: 'prompt',
      title: $t('pages.commander.dialog.title'),
      body: $t('pages.commander.dialog.descr'),
      valueAttr: { type: 'text', minlength: 3, maxlength: 10, required: true },
      response: (inputValue) => {
        goto(`/commander/${inputValue}`);
      },
      buttonTextSubmit: $t('common.next'),
      buttonTextCancel: $t('common.back'),
    });
  };
</script>

<ContentGrid>
  <PageTitle>{$t('pages.commander.title')}</PageTitle>
  <p class="col-span-12 mb-4">{$t('pages.commander.descr')}</p>

  <div class="col-span-12 grid grid-cols-1 gap-2 md:flex">
    <a href="/commander/create" class="btn variant-filled" data-sveltekit-preload-data="hover">{$t('pages.commander.btn-create')}</a>
    <button type="button" class="btn variant-filled" on:click={() => openModal()}>{$t('pages.commander.btn-view')}</button>
  </div>

  <div class="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-2 mt-8">
    {#if recentSpreads.length > 0}
      <div>
        <h4 class="mb-1">{$t('pages.commander.recent-spreads')}</h4>
        <ul>
          {#each recentSpreads as spread}
            <li>
              <a class="text-base" href="/commander/{spread.id}" data-sveltekit-preload-data>
                {spread.name}
                <small class="text-sm">({spread.id})</small>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if mission}
      <div class="col-span-6">
        <h4 class="mb-1 h4">{$t('pages.commander.mission')}</h4>
        <a class="text-base" href="/commander/mission/{mission.uuid}" data-sveltekit-preload-data>
          {mission.code}
          <small class="text-sm">({mission.uuid})</small>
        </a>
      </div>
    {/if}
  </div>
</ContentGrid>
