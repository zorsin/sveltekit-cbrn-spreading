<script lang="ts">
  import { t } from 'svelte-intl-precompile';

  import type { PageData, Snapshot } from './$types';

  import { superForm } from 'sveltekit-superforms/client';
  import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

  import { Button, PageTitle, TextField, ContentGrid } from '$lib/skeleton';

  export let data: PageData;
  const { form, enhance, errors, capture, restore } = superForm(data.form);
  export const snapshot: Snapshot = {
    capture,
    restore,
  };
  const handelError = (errors: string[] | undefined): string | undefined => {
    if (errors && errors.length > 0) {
      return $t(`pages.unit-register.${errors[0]}`);
    }
    return undefined;
  };
</script>

<ContentGrid>
  <PageTitle>{$t('pages.unit-register.title')}</PageTitle>
  <span class="col-span-12">{$t('pages.unit-register.descr')}</span>

  <form class="col-span-12 md:col-span-6 mt-4" use:enhance method="POST" action="?/register">
    <input class="hidden" bind:value={$form.missionUuid} name="missionUuid" />
    <TextField name="radio" label={$t('pages.unit-register.labels.radio')} bind:value={$form.radio} error={handelError($errors.radio)} />
    <TextField
      name="vehicle"
      label={$t('pages.unit-register.labels.vehicle')}
      bind:value={$form.vehicle}
      error={handelError($errors.vehicle)} />
    <TextField name="crew" label={$t('pages.unit-register.labels.crew')} bind:value={$form.crew} error={handelError($errors.crew)} />
    <Button type="submit" class="variant-filled mt-4">{$t('common.register')}</Button>
  </form>
</ContentGrid>
<SuperDebug data={$form} />
