import type { GeolocationCoords } from 'svelte-geolocation/types/Geolocation.svelte';
import type { Writable } from 'svelte/store';

export type UnitMissionSettings = {
  enableGPS: Writable<boolean>;
  enableMeasure: Writable<boolean>;
  coords: Writable<GeolocationCoords>;
};
