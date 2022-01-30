<!-- @component
Smelte includes convenience image component which is useful for lazyloading,
but generally we recommend using [Svelte Image](https://github.com/matyunya/svelte-image).
 -->
<script lang="ts">
  import Waypoint from 'svelte-waypoint';
  import { fade } from 'svelte/transition';
  /** Specifies an alternate text for an image.
   *
   * Default: empty string
   */
  export let alt = '';
  export let width = '';
  export let height = '';
  export let src = '';
  /** Thumbnai can be showed while the real image is loading.
   *
   * Default: empty string
   */
  export let thumbnail = '';

  let loaded = false;
  let loading = false;

  function load() {
    const img = new Image();
    img.src = src;
    loading = true;

    img.onload = () => {
      loading = false;
      loaded = true;
    };
  }
</script>

<Waypoint class={$$props.class} once on:enter={load} style="height: {height}px" offset="0">
  {#if loaded}
    <img class={$$props.class} {src} {alt} {width} {height} />
  {:else if thumbnail}
    <img class={$$props.class} src={thumbnail} {alt} {width} {height} />
  {:else if loading}
    <slot name="loading" />
  {/if}
</Waypoint>
