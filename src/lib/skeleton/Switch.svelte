<script lang="ts">
  import { SlideToggle } from '@skeletonlabs/skeleton';
  export let checked = false;
  export let required = false;
  export let disabled = false;
  export let name: string;
  let className = '';
  export { className as class };
</script>

<SlideToggle class={className} bind:checked {name} {disabled} {required}><slot /></SlideToggle>
