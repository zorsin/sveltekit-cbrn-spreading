import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';

export let darkMode: Writable<boolean> | undefined;

function isDarkTheme() {
  if (!window.matchMedia) {
    return false;
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
}

export default function dark(
  value = false,
  bodyClasses = 'mode-dark',
):
  | Writable<boolean>
  | {
      subscribe: typeof darkMode.subscribe;
      set: (v: boolean) => void;
    } {
  if (typeof window === 'undefined') return writable(value);

  if (!darkMode) {
    darkMode = writable(value || isDarkTheme());
  }

  return {
    subscribe: darkMode.subscribe,
    set: (v) => {
      bodyClasses.split(' ').forEach((c) => {
        if (v) {
          document.body.classList.add(c);
        } else {
          document.body.classList.remove(c);
        }
      });

      darkMode.set(v);
    },
  };
}
