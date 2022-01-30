<!-- @component
Tab.

Props: selecte, id

Slots: default
 -->
<script lang="ts">
  /** Selectd
   *
   * Default: undefined
   */
  export let selected: string | undefined = undefined;
  /** ID
   *
   * Default: null
   */
  export let id: string | null = null;
</script>

{#if selected === id}
  <slot />
{/if}
