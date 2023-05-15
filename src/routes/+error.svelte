<script lang="ts">
  import { page } from '$app/stores';
  import { PageTitle } from '$lib/skeleton';

  import { t } from 'svelte-intl-precompile';
</script>

<PageTitle>{$t('errors.title')}</PageTitle>
<p>{$t(`errors.codes.${$page.status}`)}</p>

<p>{$page.error.message}</p>
