<script lang="ts">
  let className = '';
  export { className as class };
  export let label: string;
  export let placeholder: string | undefined = undefined;
  export let value: string | undefined = undefined;
  export let name: string;
  export let disabled = false;
  export const type: 'text' | 'password' = 'text';

  export let error: string | undefined = undefined;

  $: errorClass = error ? 'input-error' : '';
</script>

<label class="label {className}">
  <span>{label}</span>
  {#if type === 'text'}
    <input class="input {errorClass}" type="text" bind:value {placeholder} {name} {disabled} />
  {:else if type === 'password'}
    <input class="input {errorClass}" type="password" bind:value {placeholder} {name} {disabled} />
  {/if}
  {#if error}
    <span class="text-error-500">{error}</span>
  {/if}
</label>
