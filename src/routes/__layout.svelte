<script context="module">
  import { browser, dev } from '$app/env';
  import { observe, setup } from 'twind/observe';
  import twindConfig from '$lib/twind.config';
  if (browser) {
    setup(twindConfig);
    observe(document.documentElement);
  }
</script>

<slot />
