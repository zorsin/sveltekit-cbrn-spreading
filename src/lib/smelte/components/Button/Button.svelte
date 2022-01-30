<!-- @component
Buttons allow users to take actions, and make choices, with a single tap. 

props: value, outlined, text, block, disabled, icon, small, light, dark, flat,
iconClass, color, href, fab, remove, add, replace, classes, basicClasses, outlinedClasses, 
textClasses, iconClasses, fabClasses, smallClasses, disabledClasses, elevationClasses
-->
<script lang="ts">
  import Icon from '../Icon';
  import utils, { ClassBuilder, filterProps } from '../../utils/classes';
  import createRipple from '../Ripple/ripple';
  import type { Colors } from '$types/Colors';

  /** Bound boolean value.
   *
   * Default: false */
  export let value = false;
  /** Outlined variant.
   *
   * Default: false */
  export let outlined = false;
  /** Text button variant (transparent background).
   *
   * Default: false */
  export let text = false;
  /** Full block width button.
   *
   * Default: false */
  export let block = false;
  /** Disabled state.
   *
   * Default: false */
  export let disabled = false;
  /** Icon button variant.
   *
   * Default: null */
  export let icon: string | null = null;
  /** Smaller size.
   *
   * Default: false */
  export let small = false;
  /** Lighter variant.
   *
   * Default: false */
  export let light = false;
  /** Darker variant.
   *
   * Default: false */
  export let dark = false;
  /** Flat variant.
   *
   * Default: false */
  export let flat = false;
  /** List of classes to pass down to icon(blank space separated).
   *
   * Default: empty string */
  export let iconClass: string | ((string) => string) = '';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color: Colors = 'primary';
  /** if href is supplied, button is a link
   *
   * Default: null*/
  export let href: string | null = null;
  /** Fab variant.
   *
   * Default: false */
  export let fab = false;

  export let type: 'button' | 'submit' | 'reset' = 'button';
  /** List of classes to remove from the component (blank space separated).
   *
   * Default: empty string
   */
  export let remove = '';
  /** List of classes to add to the component (blank space separated).
   *
   * Default: empty string
   */
  export let add = '';
  /** List of classes to replace in the component.
   *
   * Default: {}
   */
  export let replace: Record<string, string> = {};

  const classesDefault = 'z-10 py-2 px-4 uppercase text-sm font-medium relative overflow-hidden';
  const basicDefault = 'text-white duration-200 ease-in';

  const outlinedDefault = 'bg-transparent border border-solid';
  const textDefault = 'bg-transparent border-none px-4 hover:bg-transparent';
  const iconDefault = 'p-4 flex items-center select-none';
  const fabDefault = 'hover:bg-transparent';
  const smallDefault = 'pt-1 pb-1 pl-2 pr-2 text-xs';
  const disabledDefault =
    'bg-gray-300 text-gray-500 dark:bg-dark-400 pointer-events-none hover:bg-gray-300 cursor-default';
  const elevationDefault = 'hover:shadow shadow';

  export let classes: string = classesDefault;
  export let basicClasses: string | ((string) => string) = basicDefault;
  export let outlinedClasses: string | ((string) => string) = outlinedDefault;
  export let textClasses: string | ((string) => string) = textDefault;
  export let iconClasses: string | ((string) => string) = iconDefault;
  export let fabClasses: string | ((string) => string) = fabDefault;
  export let smallClasses: string | ((string) => string) = smallDefault;
  export let disabledClasses: string | ((string) => string) = disabledDefault;
  export let elevationClasses: string | ((string) => string) = elevationDefault;

  fab = fab || (text && !!icon);
  const basic = !outlined && !text && !fab;
  const elevation = (basic || icon) && !disabled && !flat && !text;

  let Classes = (i) => i;
  let iClasses = (i) => i;
  let shade = 0;

  $: {
    shade = light ? 200 : 0;
    shade = dark ? -400 : shade;
  }
  $: normal = 500 - shade;
  $: lighter = 400 - shade;

  const { bg, border, txt } = utils(color);

  const cb = new ClassBuilder(classes, classesDefault);
  let iconCb;

  if (icon) {
    iconCb = new ClassBuilder(iconClass, '');
  }

  $: classes = cb
    .flush()
    .add(basicClasses, basic, basicDefault)
    .add(`${bg(`${normal}`)} hover:${bg(`${lighter}`)}`, basic)
    .add(elevationClasses, elevation, elevationDefault)
    .add(outlinedClasses, outlined, outlinedDefault)
    .add(
      `${border(`${lighter}`)} ${txt(`${normal}`)} hover:${bg('trans')} dark-hover:${bg(
        'transDark',
      )}`,
      outlined,
    )
    .add(`${txt(`${lighter}`)}`, text)
    .add(textClasses, text, textDefault)
    .add(iconClasses, !!icon, iconDefault)
    .remove('py-2', !!icon)
    .remove(txt(`${lighter}`), fab)
    .add(disabledClasses, disabled, disabledDefault)
    .add(smallClasses, small, smallDefault)
    .add('flex items-center justify-center h-8 w-8', small && !!icon)
    .add('border-solid', outlined)
    .add('rounded-full', !!icon)
    .add('w-full', block)
    .add('rounded', basic || outlined || text)
    .add('button', !icon)
    .add(fabClasses, fab, fabDefault)
    .add(`hover:${bg('transLight')}`, fab)
    .add($$props.class)
    .remove(remove)
    .replace(replace)
    .add(add)
    .get();

  $: if (iconCb) {
    iClasses = iconCb
      .flush()
      .add(txt(`${lighter}`), fab && !iconClass)
      .get();
  }

  const ripple = createRipple(text || fab || outlined ? color : 'white');

  const props = filterProps(
    [
      'outlined',
      'text',
      'color',
      'block',
      'disabled',
      'icon',
      'small',
      'light',
      'dark',
      'flat',
      'add',
      'remove',
      'replace',
    ],
    $$props,
  );
</script>

{#if href}
  <a {href} {...props}>
    <button
      use:ripple
      class={classes}
      {...props}
      {type}
      {disabled}
      on:click={() => (value = !value)}
      on:click
      on:mouseover
      on:focus
    >
      {#if icon}
        <Icon class={iClasses} {small}>{icon}</Icon>
      {/if}
      <slot />
    </button>
  </a>
{:else}
  <button
    use:ripple
    class={classes}
    {...props}
    {type}
    {disabled}
    on:click={() => (value = !value)}
    on:click
    on:mouseover
    on:focus
  >
    {#if icon}
      <Icon class={iClasses} {small}>{icon}</Icon>
    {/if}
    <slot />
  </button>
{/if}
