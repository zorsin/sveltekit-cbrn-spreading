<script lang="ts">
  let className = '';
  export { className as class };
  export let label: string;
  export let placeholder: string | undefined = undefined;
  export let value: number | undefined = undefined;
  export let name: string;
  export let disabled = false;

  export let error: string | undefined = undefined;

  $: errorClass = error ? 'input-error' : '';
</script>

<label class="label {className}">
  <span>{label}</span>
  <input class="input {errorClass}" type="number" bind:value {placeholder} {name} {disabled} />
  {#if error}
    <span class="text-error-500">{error}</span>
  {/if}
</label>
