<!-- @component
Tabs can be used as navigation elements like the ones you see on the top right. You need to bind current pathname as value prop for active indicator to work correctly.

Props: selected, navigation, items, indicator, color, notSelectedColor,
loading, tabButtonClasses, classes

Slots (slot-props): item (color, item), content (selected)
 -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { ClassBuilder } from '../../utils/classes';

  import Indicator from './Indicator.svelte';
  import ProgressLinear from '../ProgressLinear';
  import TabButton from './TabButton.svelte';
  import type { Colors } from '$types/Colors';

  interface ITabButtonProps {
    text?: string;
    to?: string;
    id?: string;
  }

  /** Selected state. Bindable.
   *
   * Default: null
   */
  export let selected: string | null = null;
  /** Navigation variant.
   *
   * Default: false
   */
  export let navigation = false;
  /** Items */
  export let items: ITabButtonProps[] = [];
  /** Indicator.
   *
   * Default: true
   */
  export let indicator = true;
  /** Color
   *
   * Default: "white"
   */
  export let color: Colors = 'white';
  /** Not Selected Color
   *
   * Default: "white"
   */
  export let notSelectedColor = 'white';
  /** Loading.
   *
   * Default: false
   */
  export let loading = false;
  export let tabButtonClasses: string | ((i: string) => string) = (i) => i;
  const classesDefault = 'y-0 h-full items-center relative mx-auto z-20';
  /** Classes.
   *
   * Default: "y-0 h-full items-center relative mx-auto z-20"
   */
  export let classes: string | ((s: string) => string) = classesDefault;

  let node;
  let indicatorWidth = 0;
  let indicatorOffset = 0;
  let offset = null;

  function calcIndicator(selected: string) {
    indicatorWidth = node ? node.offsetWidth / items.length : 0;

    let left = 0;
    if (selected && items.findIndex((i) => selected.includes(i.to || i.id)) !== -1) {
      const longestMatch = items
        .map((item, index) => [index, item])
        .filter(([index, item]: [number, ITabButtonProps]) => selected.includes(item.to || item.id))
        .sort(
          (
            [index1, item1]: [number, ITabButtonProps],
            [index2, item2]: [number, ITabButtonProps],
          ) => (item2.to || item2.id).length - (item1.to || item1.id).length,
        )[0];

      if (typeof longestMatch === 'number') {
        left = <number>longestMatch[0];
        offset = left * indicatorWidth;
      }
    } else {
      offset = null;
    }
  }

  onMount(() => calcIndicator(selected));

  $: calcIndicator(selected);

  const cb = new ClassBuilder(classes, classesDefault);
  $: c = cb
    .flush()
    .add($$props.class)
    .add('hidden md:flex w-full max-w-2xl', navigation)
    .add('flex', !navigation)
    .get();
</script>

<div class={c} bind:this={node}>
  {#each items as item, i}
    <slot name="item" {color} {item}>
      <TabButton class={tabButtonClasses} bind:selected {...item} {color} {notSelectedColor}
        >{item.text}</TabButton
      >
    </slot>
  {/each}
  {#if indicator && offset !== null}
    <Indicator {color} width={indicatorWidth} left={offset} />
  {/if}
</div>
{#if loading}
  <ProgressLinear {color} />
{/if}

<slot {selected} name="content" />
