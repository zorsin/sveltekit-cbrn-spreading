import * as L from 'leaflet';

export class Control extends L.Control {
  el: HTMLElement;
  constructor(el: HTMLElement, position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright') {
    super({ position });
    this.el = el;
  }
  onAdd() {
    return this.el;
  }
  onRemove() {
    // do nothing
  }

  addTo: (map: L.map) => Control;
  remove: () => void;
}
