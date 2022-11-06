<script lang="ts">
  import { page } from '$app/stores';
  import { notifier, PageTitle } from '$lib/smelte';

  import { t } from 'svelte-intl-precompile';

  if ($page.status) {
    notifier.error($t(`errors.codes.${$page.status}`));
  }
</script>

<PageTitle>{$t('errors.title')}</PageTitle>
<p>{$t(`errors.codes.${$page.status}`)}</p>

<p>{$page.error.message}</p>
