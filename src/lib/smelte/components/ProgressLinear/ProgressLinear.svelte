<!-- @component
Linear Progress Indicator

Props: app, progress, color
 -->
<script lang="ts">
  import type { Colors } from '$types/Colors';

  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  /** class:fixed & class:z-50 wanted?
   *
   * Default: false
   */
  export let app = false;
  /** Progress. If not is provided it becomes indefinite variant.
   *
   * Default: 0
   */
  export let progress = 0;
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';

  let initialized = false;

  onMount(() => {
    if (!app) return;

    setTimeout(() => {
      initialized = true;
    }, 200);
  });
</script>

<div
  class:fixed={app}
  class:z-50={app}
  class="top-0 left-0 w-full h-1 bg-{color}-100 overflow-hidden relative {$$props.class}"
  class:hidden={app && !initialized}
  transition:slide={{ duration: 300 }}
>
  <div
    class="bg-{color}-500 h-1 absolute"
    class:inc={!progress}
    class:transition={progress}
    style={progress ? `width: ${progress}%` : ''}
  />
  <div class="bg-{color}-500 h-1 absolute dec" class:hidden={progress} />
</div>

<style>
  /* kudos https://codepen.io/shalimano/pen/wBmNGJ */
  .inc {
    animation: increase 2s ease-in-out infinite;
  }
  .dec {
    animation: decrease 2s 0.9s ease-in-out infinite;
  }

  @keyframes increase {
    from {
      left: -5%;
      width: 5%;
    }
    to {
      left: 130%;
      width: 150%;
    }
  }
  @keyframes decrease {
    from {
      left: -90%;
      width: 90%;
    }
    to {
      left: 110%;
      width: 10%;
    }
  }
</style>
