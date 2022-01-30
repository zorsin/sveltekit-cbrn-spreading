import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { onDestroy } from 'svelte';

function defaultCalc(width: number): 'xl' | 'lg' | 'md' | 'sm' {
  if (width > 1279) {
    return 'xl';
  }
  if (width > 1023) {
    return 'lg';
  }
  if (width > 767) {
    return 'md';
  }
  return 'sm';
}

export default function breakpoint(calcBreakpoint: typeof defaultCalc = defaultCalc):
  | Writable<string>
  | {
      subscribe: (
        run: (value: string) => void,
        invalidate?: (value?: string) => void,
      ) => () => void;
    } {
  if (typeof window === 'undefined') return writable('sm');

  const store = writable(calcBreakpoint(window.innerWidth));

  const onResize = ({ target }) => store.set(calcBreakpoint(target.innerWidth));

  window.addEventListener('resize', onResize);
  onDestroy(() => window.removeEventListener('resize', onResize));

  return {
    subscribe: store.subscribe,
  };
}
