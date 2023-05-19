<script lang="ts">
  import ContentGrid from '$lib/skeleton/ContentGrid.svelte';
  import PageTitle from '$lib/skeleton/PageTitle.svelte';
  import { t } from 'svelte-intl-precompile';
</script>

<ContentGrid>
  <PageTitle>{$t('pages.landing.title')}</PageTitle>
  <span class="col-span-12">{$t('pages.landing.descr')}</span>
</ContentGrid>
