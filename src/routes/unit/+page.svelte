<script lang="ts">
  import { PageTitle, Button, TextField, notifier } from '$lib/smelte';
  import { t } from 'svelte-intl-precompile';
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { goto, invalidate } from '$app/navigation';

  export let data: PageData;
  const { unitUuid, missionUuid, notify } = data;

  if (notify) {
    notifier.error($t(notify));
    goto('/unit');
  }
</script>

<PageTitle>{$t('pages.unit.title')}</PageTitle>
<span>{$t('pages.unit.descr')}</span>
<div class="w-full md:w-1/2 grid(& cols-1) gap-4 md:block mt-8">
  <form method="POST" action="?/register" use:enhance>
    <TextField name="code" label={$t('pages.unit.labels.code')} />
    <Button type="submit" replace={{ 'w-max': 'w-full md:w-max' }}
      >{$t('pages.unit.labels.check')}</Button
    >
    {#if unitUuid && missionUuid}
      <Button
        class="md:ml-4"
        href="/unit/{missionUuid}/{unitUuid}"
        replace={{ 'w-max': 'w-full md:w-max' }}>{$t('pages.unit.labels.join')}</Button
      >
    {/if}
  </form>
</div>
