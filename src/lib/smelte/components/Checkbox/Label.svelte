<!-- @component
Label component used by Checkbox
-->
<script lang="ts">
  import { ClassBuilder } from '../../utils/classes';

  const classesDefault = "pl-2 cursor-pointer 'text-gray-700 dark:text-gray-300'";

  export let classes: string | ((s: string) => string) = classesDefault;
  /** Text of the label
   *
   * Default: empty string
   */
  export let label = '';
  /** Disabled state.
   *
   * Default: false
   */
  export let disabled = false;
  /** Classes to pass down to checkbox wrapper if disabled.
   *
   * Default: "text-gray-500 dark:text-gray-600"
   */
  export let disabledClasses = 'text-gray-500 dark:text-gray-600';

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb
    .flush()
    .add(classes, true, classesDefault)
    .add(disabledClasses, disabled)
    .add($$props.class)
    .get();
</script>

<label aria-hidden="true" {...$$props} class={c}>
  <slot>{label}</slot>
</label>
