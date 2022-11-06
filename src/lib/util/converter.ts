export type ConvertIntputToLatLng = (input: string) => [number, number];

export const convertInputToLatLng = (input: string) => {
  if (input && typeof input === 'string') {
    const stringLatLon = input.split(',');
    return [parseFloat(stringLatLon[0]), parseFloat(stringLatLon[1])];
  }
  return [0, 0];
};
