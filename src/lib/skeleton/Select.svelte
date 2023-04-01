<script lang="ts">
  import type { SelectOption } from './types';

  let className = '';
  export { className as class };
  export let label: string;
  export let options: SelectOption[] = [];
  export let name: string;
  export let disabled = false;
  export let value: string | undefined = undefined;
  export let required = false;
</script>

<labelc lass="label {className}">
  <span>{label}</span>

  <select class="select" {name} {required} bind:value {disabled}>
    {#each options as option, index}
      <option value={option.value}>{option.text}</option>
    {/each}
  </select>
</labelc>
