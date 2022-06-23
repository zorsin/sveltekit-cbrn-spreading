<script lang="ts">
  import { PageTitle, Checkbox, SolidTrash, notifier } from '$lib/smelte';
  import { invalidate } from '$app/navigation';
  import { page } from '$app/stores';
  import Button from '$lib/smelte/components/Button/Button.svelte';
  import { t } from 'svelte-intl-precompile';
  export let mission;

  const onDelUnitClick = async (unitUuid: string) => {
    const res = await fetch(`/api/mission/units`, {
      method: 'delete',
      body: JSON.stringify({ missionUuid: mission.uuid, unitUuid }),
    });
    if (res.ok) {
      notifier.success($t('pages.commander-mission.delete-success'));
      await invalidate($page.url.pathname);
    }
  };
</script>

<!-- {JSON.stringify(mission)} -->
<PageTitle>{$t('pages.commander-mission.title')}</PageTitle>
<div class="grid(& cols-12) gap-4">
  <span class="col-span-2"
    >{$t('pages.commander-mission.labels.code', { values: { code: mission.code } })}</span
  >
  <div class="row-start-2 col(start-1 end-7) bg-success-900 h-20">
    <!-- map -->
  </div>
  <div class="row-start-2 col(start-7 end-13) ">
    <!-- units -->
    <h4 class="text-lg">{$t('pages.commander-mission.labels.units')}</h4>
    <div class="flex flex-col">
      {#each mission.units as unit}
        <div
          class="bg-dark-500 mt-4 grid(& cols-5) gap-2 items-center border(& 2 primary-700) rounded py-2"
        >
          <div>
            <Checkbox />
          </div>
          <div class="col-span-3">
            <h6 class="text-base mb-2">{unit.radio} - {unit.vehicle}</h6>
            <p class="text-sm">{unit.crew}</p>
          </div>
          <div>
            <Button on:click={() => onDelUnitClick(unit.unitUuid)}>
              <SolidTrash />
            </Button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
