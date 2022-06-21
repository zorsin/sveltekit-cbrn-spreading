<!-- @component
Text fields let users enter and edit text.

Props: outlined, value, label, placeholder,
hint, error, append, prepend, persitentHint, textarea,
rows, select, dense, autocomplete, noUnderline, 
appendReverse, prependReverse, color, bgColor,
iconClass, disabled, add, remove, replace, inputClasses, classes,
appendClasses, prependClasses, extend, focused

Slots: label, append, prepend
-->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import utils, { ClassBuilder, filterProps } from '../../utils/classes';
  import Icon from '../Icon';
  import Label from './Label.svelte';
  import Hint from './Hint.svelte';
  import Underline from './Underline.svelte';
  import type { Colors } from '$types/Colors';

  const inputDefault = 'pb-2 pt-6 px-4 rounded-t text-black dark:text-gray-100 w-full';
  const classesDefault = 'mt-2 mb-6 relative text-gray-600 dark:text-gray-100';
  const appendDefault = 'absolute right-0 top-0 pb-2 pr-4 pt-4 text-gray-700 z-10';
  const prependDefault = 'absolute left-0 top-0 pb-2 pl-2 pt-4 text-xs text-gray-700 z-10';
  /** Outlined variant.
   *
   * Default: false
   */
  export let outlined = false;
  /** Input value. Bindable.
   *
   * Default: null
   */
  export let value: string | null = null;
  /** Input label.
   *
   * Default: empty string
   */
  export let label = '';
  /** Placeholder.
   *
   * Default: empty string
   */
  export let placeholder = '';
  /** Hint text appearing under the input.
   *
   * Default: empty string
   */
  export let hint = '';
  /** Error text under the input.
   *
   * Default: false
   */
  export let error: string | boolean = false;
  /** Append icon name.
   *
   * Default: empty string
   */
  export let append = '';
  /** Prepend icon name.
   *
   * Default: empty string
   */
  export let prepend = '';
  /** Always show hint, not only on focus.
   *
   * Default: false
   */
  export let persistentHint = false;
  /** Whether text field is textarea.
   *
   * Default: false
   */
  export let textarea = false;
  /** Rows count for textarea.
   *
   * Default: 5
   */
  export let rows = 5;
  /** Whether text field is select.
   *
   * Default: false
   */
  export let select = false;
  /** Dense variant.
   *
   * Default: false
   */
  export let dense = false;
  /** Whether select field is autocomplete.
   *
   * Default: false
   */
  export let autocomplete = false;
  /** Hide focus underline element.
   *
   * Default: false
   */
  export let noUnderline = false;
  /** Reverse appended icon.
   *
   * Default: false
   */
  export let appendReverse = false;
  /** Reverse prepended icon
   *
   * Default: false
   */
  export let prependReverse = false;
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary"
   */
  export let color: Colors = 'primary';
  // for outlined button label
  /** Background color to match for outlined elevated label.
   *
   * Default: "white"
   */
  export let bgColor = 'white';
  /** Classes to pass down to icon component.
   *
   * Default: empty string
   */
  export let iconClass = '';
  /** Disabled variant.
   *
   * Default: false
   */
  export let disabled = false;
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
  /** Name of the input for forms
   *
   */
  export let name = undefined;

  export let inputClasses: string | ((s: string) => string) = inputDefault;
  export let classes: string | ((s: string) => string) = classesDefault;
  export let appendClasses: string | ((s: string) => string) = appendDefault;
  export let prependClasses: string | ((s: string) => string) = prependDefault;
  export let extend = (): void => {};
  /** Focused. Bindable.
   *
   * Default: false
   */
  export let focused = false;
  const { bg, border, txt, caret } = utils(color);

  const cb = new ClassBuilder(inputClasses, inputDefault);
  const ccb = new ClassBuilder(classes, classesDefault);
  const acb = new ClassBuilder(appendClasses, appendDefault);
  const pcb = new ClassBuilder(prependClasses, prependDefault);

  let wClasses: string = '';
  let aClasses: string = '';
  let pClasses: string = '';

  function toggleFocused() {
    focused = !focused;
  }

  $: showHint = error || (persistentHint ? hint : focused && hint);
  $: labelOnTop = placeholder || focused || value || value === '0';

  $: iClasses = cb
    .flush()
    .remove('pt-6 pb-2', outlined)
    .add('border rounded bg-transparent py-4 duration-200 ease-in', outlined)
    .add('border-error-500 caret-error-500', !!error)
    .remove(caret(''), !!error)
    .add(caret(''), !error)
    .add(border(''), outlined && focused && !error)
    .add('bg-gray-100 dark:bg-dark-600', !outlined)
    .add('bg-gray-300 dark:bg-dark-200', focused && !outlined)
    .remove('px-4', !!prepend)
    .add('pr-4 pl-10', !!prepend)
    .add(add)
    .remove('pt-6 pb-2', dense && !outlined)
    .add('pt-4 pb-1', dense && !outlined)
    .remove('bg-gray-100', disabled)
    .add('bg-gray-50', disabled)
    .add('cursor-pointer', select && !autocomplete)
    .add($$props.class)
    .remove(remove)
    .replace(replace)
    .extend(extend)
    .get();

  $: wClasses = ccb
    .flush()
    .add('select', select || autocomplete)
    .add('dense', dense && !outlined)
    .remove('mb-6 mt-2', dense && !outlined)
    .add('mb-4 mt-1', dense)
    .replace({ 'text-gray-600': 'text-error-500' }, !!error)
    .add('text-gray-200', disabled)
    .get();

  $: aClasses = acb.flush().get();
  $: pClasses = pcb.flush().get();

  const props = filterProps(
    [
      'outlined',
      'label',
      'placeholder',
      'hint',
      'error',
      'append',
      'prepend',
      'persistentHint',
      'textarea',
      'rows',
      'select',
      'autocomplete',
      'noUnderline',
      'appendReverse',
      'prependReverse',
      'color',
      'bgColor',
      'disabled',
      'replace',
      'remove',
      'small',
    ],
    $$props,
  );

  const dispatch = createEventDispatcher();
  if (!name) {
    name = `text-${Math.random().toString().slice(4)}`;
  }
</script>

<div class={wClasses}>
  {#if label}
    <slot name="label">
      <Label
        {name}
        labelOnTop={!!labelOnTop}
        {focused}
        {error}
        {outlined}
        prepend={!!prepend}
        {color}
        {bgColor}
        dense={dense && !outlined}>{label}</Label
      >
    </slot>
  {/if}

  {#if (!textarea && !select) || autocomplete}
    <input
      {name}
      aria-label={label}
      class={iClasses}
      on:focus={toggleFocused}
      on:blur={toggleFocused}
      on:blur
      bind:value
      on:change
      on:input
      on:keydown
      on:keypress
      on:keyup
      {disabled}
      on:click
      on:focus
      {...props}
      placeholder={!value ? placeholder : ''}
    />
  {:else if textarea && !select}
    <textarea
      {rows}
      {name}
      aria-label={label}
      class={iClasses}
      on:change
      on:input
      on:keydown
      on:keypress
      on:keyup
      {disabled}
      on:click
      on:focus
      on:blur
      bind:value
      {...props}
      on:focus={toggleFocused}
      on:blur={toggleFocused}
      placeholder={!value ? placeholder : ''}
    />
  {:else if select && !autocomplete}
    <input
      readonly
      {name}
      class={iClasses}
      on:change
      on:input
      on:keydown
      on:keypress
      on:keyup
      {disabled}
      on:click
      on:blur
      on:focus
      {value}
    />
  {/if}

  {#if append}
    <div class={aClasses} on:click={() => dispatch('click-append')}>
      <slot name="append">
        <Icon reverse={appendReverse} class="{focused ? txt('') : ''} {iconClass}">
          {append}
        </Icon>
      </slot>
    </div>
  {/if}

  {#if prepend}
    <div class={pClasses} on:click={() => dispatch('click-prepend')}>
      <slot name="prepend">
        <Icon reverse={prependReverse} class="{focused ? txt('') : ''} {iconClass}">
          {prepend}
        </Icon>
      </slot>
    </div>
  {/if}

  <Underline {noUnderline} {outlined} {focused} error={!!error} {color} />

  {#if showHint}
    <Hint error={!!error} {hint} />
  {/if}
</div>
