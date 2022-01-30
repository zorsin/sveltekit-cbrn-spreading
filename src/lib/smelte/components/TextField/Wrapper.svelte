<script lang="ts">
  import utils, { ClassBuilder, filterProps } from '../../utils/classes';

  let classesDefault = 'mt-2 mb-6 relative text-gray-600';
  /** Error variant.
   *
   * Default: false
   */
  export let error = false;
  /** Select variant.
   *
   * Default: false
   */
  export let select = false;
  /** Autocomplete variant.
   *
   * Default: false
   */
  export let autocomplete = false;
  /** List of classes to add to the component (blank space separated).
   *
   * Default: empty string
   */
  export let add = '';
  /** List of classes to remove from the component (blank space separated).
   *
   * Default: empty string
   */
  export let remove = '';
  /** List of classes to replace in the component.
   *
   * Default: {}
   */
  export let replace: Record<string, string> = {};

  const l = new ClassBuilder($$props.class, classesDefault);

  let Classes = (i) => i;

  $: classes = l
    .flush()
    .add('select', select || autocomplete)
    .replace({ 'text-gray-600': 'text-error-500' }, error)
    .add(add)
    .replace(replace)
    .remove(remove)
    .get();

  const props = filterProps(['error', 'hint', 'select', 'autocomplete'], $$props);
</script>

<div class={classes}>
  <slot />
</div>
