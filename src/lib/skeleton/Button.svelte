<script lang="ts">
  let className = '';
  export { className as class };
  export let type: 'button' | 'reset' | 'submit' = 'button';
</script>

<button {type} class="btn variant-filled {className}" on:click><slot /></button>
