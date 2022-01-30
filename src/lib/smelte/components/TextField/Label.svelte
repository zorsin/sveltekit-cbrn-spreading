<!-- @component
  Default Label for TextField
-->
<script lang="ts">
  import type { Colors } from '$types/Colors';

  import utils, { ClassBuilder, filterProps } from '../../utils/classes';

  const labelDefault = `pt-4 absolute top-0 label-transition block pb-2 px-4 pointer-events-none cursor-text`;

  /** Focused variant.
   *
   * Default: false
   */
  export let focused = false;
  /** Error variant.
   *
   * Default: false
   */
  export let error: string | boolean = false;
  /** Outlined variant.
   *
   * Default: false
   */
  export let outlined = false;
  /** Label on top variant.
   *
   * Default: false
   */
  export let labelOnTop = false;
  /** Prepend variant.
   *
   * Default: false
   */
  export let prepend = false;
  /** Color.
   *
   * Default: "primary"
   */
  export let color: Colors = 'primary';
  /** Background Color.
   *
   * Default: "white"
   */
  export let bgColor = 'white';
  /** Dense variant.
   *
   * Default: false
   */
  export let dense = false;
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

  export let labelClasses: string | ((s: string) => string) = labelDefault;

  export let name;
  const { border, txt } = utils(color);
  const l = new ClassBuilder(labelClasses, labelDefault);

  let lClasses: string = '';

  $: lClasses = l
    .flush()
    .add(txt(''), focused && !error)
    .add('text-error-500', focused && !!error)
    .add('label-top text-xs', labelOnTop)
    .add('text-xs', focused)
    .remove('pt-4 pb-2 px-4 px-1 pt-0', labelOnTop && outlined)
    .add(`ml-3 p-1 pt-0 mt-0 bg-${bgColor} dark:bg-dark-500`, labelOnTop && outlined)
    .remove('px-4', prepend)
    .add('pr-4 pl-10', prepend)
    .remove('pt-4', dense)
    .add('pt-3', dense)
    .add(add)
    .remove(remove)
    .replace(replace)
    .get();

  const props = filterProps(
    ['focused', 'error', 'outlined', 'labelOnTop', 'prepend', 'color', 'dense'],
    $$props,
  );
</script>

<label for={name} class="{lClasses} {$$props.class}" {...props}>
  <slot />
</label>

<style>
  .label-top {
    line-height: 0.05;
  }
  .label-transition {
    transition: font-size 0.05s, line-height 0.1s;
  }
  :global(label.text-xs) {
    font-size: 0.7rem;
  }
</style>
