<script lang="ts">
  import { SlideToggle } from '@skeletonlabs/skeleton';
  export let checked = false;
  export let required = false;
  export let disabled = false;
  export let name: string;
</script>

<SlideToggle bind:checked {name} {disabled} {required}><slot /></SlideToggle>
