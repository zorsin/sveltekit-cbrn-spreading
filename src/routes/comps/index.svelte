<script lang="ts">
  import {
    Button,
    TextField,
    PageTitle,
    Checkbox,
    RadioButton,
    RadioButtonGroup,
    Slider,
    Select,
  } from '$lib/smelte';

  let disabled = true;

  const radioItems = [
    {
      label: 'Option 1',
      value: 'option1',
    },
    {
      label: 'Option 2',
      value: 'option2',
    },
  ];

  const selectItems = [
    { value: 'value1', text: 'Display Value' },
    { value: 'value2', text: 'Display Value 2' },
  ];

  let sliderValue = 0;

  $: tfValue = String(sliderValue);
</script>

<PageTitle>Hello</PageTitle>
<TextField label="Enter name" color="secondary" />
<TextField label="Enter name" color="primary" />
<Button
  on:click={() => {
    disabled = !disabled;
  }}>ASD</Button
>
<Checkbox {disabled} label="A checkbox" checked />

<RadioButtonGroup class="h-20" name="Select on Item" items={radioItems} />
<RadioButton label="Single Button" name="sradio" value="singleoption" color="secondary" />
<Button color="primary">PRIM</Button>
<Button color="secondary">SEC</Button>
<Button color="alert">ALER</Button>

<Select items={selectItems} />
<Slider label="Slider" bind:value={sliderValue} />
<TextField bind:value={tfValue} disabled />
