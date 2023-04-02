<script lang="ts">
  import { t } from 'svelte-intl-precompile';

  import { modalStore } from '@skeletonlabs/skeleton';
  import { Button, TextField } from '..';

  export let parent: any;
  export let form: any;
  export let errors: any;
  export let enhance: any;
  export let tainted: any;

  // Base Classes
  const cBase = 'card p-4 w-modal shadow-xl space-y-4';
  const cHeader = 'text-2xl font-bold';
  const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

  const handelError = (errors: string[] | undefined): string | undefined => {
    if (errors && errors.length > 0) {
      return $t(`pages.commander-view.${errors[0]}`);
    }
    return undefined;
  };
</script>

<div class="modal-example-form {cBase}">
  <header class={cHeader}>{$modalStore[0]?.title ?? ''}</header>
  <article>{@html $modalStore[0]?.body ?? ''}</article>

  <form class="modal-form {cForm}" id="modal-save" method="POST" action="?/start" use:enhance>
    <TextField name="code" label={$t('pages.commander-view.dialog.label-code')} bind:value={$form.code} error={handelError($errors.code)} />
    <input value={$form.angle} name="angle" type="number" hidden />
    <input value={$form.strength} name="strength" type="number" hidden />
    <input value={$form.length} name="length" type="number" hidden />
    <input value={$form.width} name="width" type="number" hidden />
    <input value={$form.name} name="name" type="text" hidden />
    <input value={$form.uuid} name="uuid" type="text" hidden />
    <input value={$form.mode} name="mode" type="text" hidden />
    <input value={$form.start} name="start" type="text" hidden />
  </form>
  <footer class="modal-footer {parent.regionFooter}">
    <Button class={parent.buttonNeutral} on:click={parent.onClose}>{$t('common.back')}</Button>
    <Button class={parent.buttonPositive} type="submit" form="modal-save">{$t('common.start')}</Button>
  </footer>
</div>
