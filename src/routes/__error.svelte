<script context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export function load({ error, status }) {
    console.log(error);
    return {
      props: {
        status,
        msg: error.message,
      },
    };
  }
</script>

<script lang="ts">
  import { page } from '$app/stores';
  import { notifier, PageTitle } from '$lib/smelte';

  import { t } from 'svelte-intl-precompile';

  export let msg;
  export let status;

  if (status) {
    notifier.error($t(`errors.codes.${status}`));
  }
  console.log($page);
</script>

<PageTitle>{$t('errors.title')}</PageTitle>
<p>{$t(`errors.codes.${status}`)}</p>

<p>{msg}</p>
