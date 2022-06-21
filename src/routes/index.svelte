<script lang="ts">
  import { PageTitle } from '$lib/smelte';
  import { t } from 'svelte-intl-precompile';
</script>

<PageTitle>{$t('pages.landing.title')}</PageTitle>
<span>{$t('pages.landing.descr')}</span>
