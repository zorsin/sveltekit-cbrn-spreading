<!-- @component
  Underline for TextField component 
-->
<script lang="ts">
  import type { Colors } from '$types/Colors';

  import utils, { ClassBuilder, filterProps } from '../../utils/classes';
  const defaultClasses = `mx-auto w-0`;
  /** No underline variant.
   *
   * Default: false
   */
  export let noUnderline = false;
  /** Outlined variant.
   *
   * Default: false
   */
  export let outlined = false;
  /** Focused variant:
   *
   * Default: false
   */
  export let focused = false;
  /** Error variant.
   *
   * Default: false
   */
  export let error: boolean = false;
  /** Color.
   *
   * Default: "primary"
   */
  export let color: Colors = 'primary';

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

  export let lineClasses: string | ((s: string) => string) = defaultClasses;

  const { bg, border, txt, caret } = utils(color);

  const l = new ClassBuilder(lineClasses, defaultClasses);

  let Classes = (i) => i;

  $: classes = l
    .flush()
    .add(txt(''), focused && !error)
    .add('bg-error-500', !!error)
    .add('w-full', focused || !!error)
    .add(bg(''), focused)
    .add(add)
    .remove(remove)
    .replace(replace)
    .get();

  const props = filterProps(
    ['focused', 'error', 'outlined', 'labelOnTop', 'prepend', 'bgcolor', 'color'],
    $$props,
  );
</script>

<div
  class="line absolute bottom-0 left-0 w-full bg-gray-600 {$$props.class}"
  class:hidden={noUnderline || outlined}
>
  <div class={classes} style="height: 2px; transition: width .2s ease" />
</div>

<style>
  .line {
    height: 1px;
  }
</style>
