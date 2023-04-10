<script lang="ts">
  let className = '';
  export { className as class };
  export let checked = false;
</script>

<label class="flex items-center space-x-2 {className}">
  <input class="checkbox" type="checkbox" checked />
  <p><slot /></p>
</label>
