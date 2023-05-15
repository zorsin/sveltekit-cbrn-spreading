<script lang="ts">
  import { page } from '$app/stores';
  import { ContentGrid, PageTitle } from '$lib/skeleton';

  import { t } from 'svelte-intl-precompile';
</script>

<ContentGrid>
  <PageTitle>{$t('errors.title')}</PageTitle>
  <p class="col-span-12">{$t(`errors.codes.${$page.status}`)}</p>
  <p class="col-span-12">{$page.error.message}</p>
</ContentGrid>
