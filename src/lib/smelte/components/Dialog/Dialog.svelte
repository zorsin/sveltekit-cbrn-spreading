<!-- @component
Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks.

Props: value, classes, titleClasses, acrionsClasses, opacity, persistent, transitionProps

Slots: default, title, actions
-->
<script lang="ts">
  import { scale } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { quadIn } from 'svelte/easing';
  import { Scrim } from '../Util';
  import { ClassBuilder } from '../../utils/classes';

  const classesDefault = 'items-center z-50 rounded bg-white dark:bg-dark-400 p-4 shadow';
  const titleClassesDefault = 'text-lg font-bold pb-4';
  const actionsClassesDefault = 'flex w-full justify-end pt-4';
  /** If true, dialog is shown. Boundable */
  export let value;
  /** List of classes to pass down to dialog div(blank space separated). Can also provide a function that changes defaults, e.g. (s)=>s + " mx-3"
   *
   * Default: "items-center z-50 rounded bg-white dark:bg-dark-400 p-4 shadow" */
  export let classes: string | ((s: string) => string) = classesDefault;
  /** List of classes to pass down to dialog title(blank space separated). Can also provide a function that changes defaults, e.g. (s)=>s + " mx-3"
   *
   * Default: "text-lg font-bold pb-4" */
  export let titleClasses: string | ((s: string) => string) = titleClassesDefault;
  /** List of classes to pass down to dialog actions(blank space separated). Can also provide a function that changes defaults, e.g. (s)=>s + " mx-3"
   *
   * Default: "text-lg font-bold pb-4" */
  export let actionsClasses: string | ((s: string) => string) = actionsClassesDefault;
  /** Opacity, between 0 and 1.
   *
   * Default: .5
   */
  export let opacity = 0.5;
  /** Persistent dialog will not close if clicked somewhere outside.
   *
   * Default: false
   */
  export let persistent = false;
  /** Transistion Props.
   *
   * Default: { duration: 150, easing: quadIn, delay: 150 }
   */
  export let transitionProps: {
    duration: number;
    easing: typeof quadIn;
    delay?: number;
  } = { duration: 150, easing: quadIn, delay: 150 };

  const cb = new ClassBuilder(classes, classesDefault);
  const tcb = new ClassBuilder(titleClasses, titleClassesDefault);
  const acb = new ClassBuilder(actionsClasses, actionsClassesDefault);

  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();

  $: t = tcb.flush().add(titleClasses, true, actionsClassesDefault).get();

  $: a = acb.flush().add(actionsClasses, true, actionsClassesDefault).get();
</script>

{#if value}
  <div class="fixed w-full h-full top-0 left-0 z-30">
    <Scrim {opacity} on:click={() => !persistent && (value = false)} />
    <div class="h-full w-full absolute flex items-center justify-center">
      <div in:scale={transitionProps} class={c}>
        <div class={t}>
          <slot name="title" />
        </div>
        <slot />
        <div class={a}>
          <slot name="actions" />
        </div>
      </div>
    </div>
  </div>
{/if}
