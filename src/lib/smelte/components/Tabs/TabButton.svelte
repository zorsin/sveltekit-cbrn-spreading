<!-- @component
Tab Button

Props: classes, icon, id, text, to, selected, color, notSelectedColor, 
tabClasses

Slots: default
 -->
<script lang="ts">
  import Icon from '../Icon';
  import createRipple from '../Ripple/ripple';
  import utils, { ClassBuilder } from '../../utils/classes';

  const classesDefault =
    'duration-100 relative overflow-hidden text-center w-full h-full p-4 cursor-pointer flex mx-auto items-center text-sm h-full';
  /** Classes
   *
   * Default: "duration-100 relative overflow-hidden text-center w-full h-full p-4 cursor-pointer flex mx-auto items-center text-sm h-full"
   */
  export let classes: string | ((s: string) => string) = classesDefault;
  /** Icon to show at button.
   *
   * Default: empty string
   */
  export let icon = '';
  /** ID. To compare with "selected".
   *
   * Default: empty string
   */
  export let id = '';
  /** Text.
   *
   * Default: empty string
   */
  export let text = '';
  /** To Href. If set button will be a link.
   *
   * Default: empty string
   */
  export let to = '';
  /** Selected state.
   *
   * Default: empty string
   */
  export let selected = '';
  /** Color variant, accepts any of the main colors described in Tailwind config.
   *
   * Default: "primary" */
  export let color = 'primary';
  /** Not Selected Color.
   *
   * Default: "white"
   */
  export let notSelectedColor = 'white';
  /** Tab Classes.
   *
   * Default: "flex flex-col items-center content-center mx-auto"
   */
  export let tabClasses: string = 'flex flex-col items-center content-center mx-auto';

  const ripple = createRipple(color);

  const { txt, bg } = utils(color);
  const notSelected = utils(notSelectedColor);

  $: textColor = selected === id ? txt('') : notSelected.txt('');

  const cb = new ClassBuilder(classes, classesDefault);

  $: c = cb
    .flush()
    .add($$props.class)
    .add('uppercase', !!icon)
    .add(textColor)
    .add(`hover:bg-${color}-transLight hover:${txt('900')}`)
    .get();
</script>

{#if to}
  <a use:ripple href={to} class={c} on:click>
    <div class={tabClasses}>
      {#if icon}
        <Icon class="mb-1" color={textColor}>{icon}</Icon>
      {/if}

      <div>
        <slot>{text}</slot>
      </div>
    </div>
  </a>
{:else}
  <li use:ripple class={c} on:click={() => (selected = id)} on:click>
    <div class={tabClasses}>
      {#if icon}
        <Icon class="mb-1" color={textColor}>{icon}</Icon>
      {/if}

      <div>
        <slot>{text}</slot>
      </div>
    </div>
  </li>
{/if}
