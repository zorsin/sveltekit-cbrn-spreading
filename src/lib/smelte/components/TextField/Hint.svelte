<!-- @component
Hint for TextField component
 -->
<script lang="ts">
  import utils, { ClassBuilder, filterProps } from '../../utils/classes';
  import { fly } from 'svelte/transition';
  import { quadOut } from 'svelte/easing';

  let classesDefault = 'text-xs py-1 pl-4 absolute left-0';
  /** Error variant.
   *
   * Default: false
   */
  export let error: boolean = false;
  /** Hint text.
   *
   * Default: empty string
   */
  export let hint = '';
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
  /** Fly transition props.
   *
   * Default: { y: -10, duration: 100, easing: quadOut }
   */
  export let transitionProps: {
    y?: number;
    duration?: number;
    easing?: typeof quadOut;
    delay?: number;
    x?: number;
    opacity?: number;
  } = { y: -10, duration: 100, easing: quadOut };

  const l = new ClassBuilder($$props.class, classesDefault);

  let Classes = (i) => i;

  $: classes = l
    .flush()
    .add('text-gray-600', !!hint && !error)
    .add('text-error-500', !!error)
    .add(add)
    .remove(remove)
    .replace(replace)
    .get();

  const props = filterProps(['error', 'hint'], $$props);
</script>

<div class={classes} transition:fly={transitionProps}>
  {@html hint || ''}
</div>
