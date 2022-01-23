<script context="module">
	import { browser, dev } from '$app/env';
	import { observe, setup } from 'twind/observe';
	import twindConfig from '../../twind.config';
	if (browser) {
		setup(twindConfig);
		observe(document.documentElement);
	}
</script>

<main class="bg-red-500">
	<slot />
</main>
