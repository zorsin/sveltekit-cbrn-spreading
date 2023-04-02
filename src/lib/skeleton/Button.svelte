<script lang="ts">
  let className = '';
  export { className as class };
  export let type: 'button' | 'reset' | 'submit' = 'button';
  export let formaction: string | undefined = undefined;
  export let disabled: boolean = false;
  export let form: string | undefined = undefined;
</script>

<button {type} class="btn {className}" {disabled} {formaction} {form} on:click><slot /></button>
