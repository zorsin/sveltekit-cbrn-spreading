<script lang="ts">
  import { PageTitle, Button, Dialog, TextField } from '$lib/smelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { t } from 'svelte-intl-precompile';

  let showDialog = false;
  let inputValue = '';

  const closeDialog = () => {
    showDialog = false;
    inputValue = '';
  };

  const gotoSpread = () => {
    goto(`${$page.url.pathname}/${inputValue}`);
  };
</script>

<PageTitle>{$t('pages.commander.title')}</PageTitle>
<span>{$t('pages.commander.descr')}</span>
<div class="flex mt-8 gap-4">
  <Button href={`${$page.url.pathname}/create`}>{$t('pages.commander.btn-create')}</Button>
  <Button on:click={() => (showDialog = true)}>{$t('pages.commander.btn-view')}</Button>
</div>

<Dialog bind:value={showDialog} persistent>
  <h5 slot="title">{$t('pages.commander.dialog.title')}</h5>
  <div>{$t('pages.commander.dialog.descr')}</div>
  <TextField label={$t('pages.commander.dialog.input-label')} bind:value={inputValue} />
  <div slot="actions">
    <Button on:click={closeDialog}>{$t('common.back')}</Button>
    <Button on:click={gotoSpread}>{$t('common.next')}</Button>
  </div>
</Dialog>
