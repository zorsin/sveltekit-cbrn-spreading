<script lang="ts">
  import { ClassBuilder } from '../../utils/classes';
  const classesDefault = 'flex px-4 py-2 items-center';
  export const hover = true;
  /** The title of the card.
   *
   * Default: empty string
   */
  export let title = '';
  /** The subtitle of the card
   *
   * Default: empty string
   */
  export let subheader = '';
  /** Url/Href of a picture.
   *
   * Default: empty string
   */
  export let avatar = '';
  /** String of root element classes.
   *
   * Default: "flex px-4 py-2 items-center"
   */
  export let classes = classesDefault;

  const cb = new ClassBuilder(classes, classesDefault);

  $: c = cb.flush().add(classes, true, classesDefault).add($$props.class).get();
</script>

<div class={c}>
  <div>
    <img
      class="rounded-full"
      width="44"
      height="44"
      src={avatar}
      alt="avatar"
      class:hidden={!avatar}
    />
  </div>
  <div class="pl-4 py-2">
    <div class:hidden={!title} class="font-medium text-lg">{title}</div>
    <div class="text-sm text-gray-600 pt-0" class:hidden={!subheader}>
      {subheader}
    </div>
  </div>
</div>
