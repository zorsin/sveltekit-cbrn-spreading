<script lang="ts">
  import { PageTitle, Button, Dialog, TextField, notifier } from '$lib/smelte';
  import { navigating, session } from '$app/stores';
  import { goto, prefetch } from '$app/navigation';
  import { t } from 'svelte-intl-precompile';

  export let unitUuid;
  export let missionUuid;

  let code;
  const onCheckClick = async () => {
    const res = await fetch(`/api/mission?code=${code}`);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      if (data?.mission?.uuid) {
        $session = { ...$session, missionUuid: data.mission.uuid };
        goto('/unit/register');
      }
    }
  };

  const onJoinClick = () => {
    goto(`/unit/${missionUuid}/${unitUuid}`);
  };
</script>

<PageTitle>{$t('pages.unit.title')}</PageTitle>
<span>{$t('pages.unit.descr')}</span>
<div class="w-1/2">
  <TextField label={$t('pages.unit.labels.code')} bind:value={code} />
  <Button on:click={onCheckClick}>{$t('pages.unit.labels.check')}</Button>
  {#if unitUuid && missionUuid}
    <Button class="ml-4" on:click={onJoinClick}>{$t('pages.unit.labels.join')}</Button>
  {/if}
</div>
