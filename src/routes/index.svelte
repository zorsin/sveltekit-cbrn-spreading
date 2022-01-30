<script lang="ts">
  import { Button, TextField, PageTitle, Checkbox } from '$lib/smelte';
  let disabled = true;
</script>

<PageTitle>Hello</PageTitle>
<TextField label="Enter name" />
<Button
  on:click={() => {
    disabled = !disabled;
  }}>ASD</Button
>
<Checkbox {disabled} label="A checkbox" checked />
