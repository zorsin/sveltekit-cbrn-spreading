<script context="module" lang="ts">
  export const load = async ({ params }) => {
    return {
      status: 200,
      props: {
        spreadId: params.id,
      },
    };
  };
</script>

<script lang="ts">
  import { PageTitle } from '$lib/smelte';
  import { t } from 'svelte-intl-precompile';
  export let spreadId;
</script>

<PageTitle>{$t('pages.commander-view.title', { values: { id: spreadId } })}</PageTitle>
