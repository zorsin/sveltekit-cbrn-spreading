<script lang="ts">
  import ContentGrid from '$lib/skeleton/ContentGrid.svelte';
  import { PageTitle } from '$lib/smelte';
  import { t } from 'svelte-intl-precompile';
</script>

<ContentGrid>
  <h1 class="col-span-12 mb-8">{$t('pages.landing.title')}</h1>
  <span class="col-span-12">{$t('pages.landing.descr')}</span>
</ContentGrid>
