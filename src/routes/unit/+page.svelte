<script lang="ts">
  import { t } from 'svelte-intl-precompile';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { Button, PageTitle, TextField } from '$lib/skeleton';
  import ContentGrid from '$lib/skeleton/ContentGrid.svelte';

  export let data: PageData;
  const { unitUuid, missionUuid, notify } = data;

  if (notify) {
    goto('/unit');
  }
</script>

<ContentGrid>
  <PageTitle>{$t('pages.unit.title')}</PageTitle>
  <span class="col-span-12">{$t('pages.unit.descr')}</span>
  <form class="col-span-6 mt-6" method="POST" action="?/register" use:enhance>
    <TextField name="code" label={$t('pages.unit.labels.code')} />
    <Button class="variant-filled mt-4" type="submit">{$t('pages.unit.labels.check')}</Button>
    {#if unitUuid && missionUuid}
      <a class="md:ml-4 btn variant-filled mt-4" href="/unit/{missionUuid}/{unitUuid}">{$t('pages.unit.labels.join')}</a>
    {/if}
  </form>
</ContentGrid>

<div class="w-full md:w-1/2 grid(& cols-1) gap-4 md:block mt-8" />
