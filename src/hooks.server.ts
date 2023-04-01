import { handleSession } from 'svelte-kit-cookie-session';
import { sequence } from '@sveltejs/kit/hooks';

const regexpNoSSR = /^\/(commander|unit)\/\w+/;
/** @type {import('@sveltejs/kit').Handle} */
const customHandle = async ({ event, resolve }) => {
  // disable ssr for all pages with leaflet, ssr has missing window
  if (regexpNoSSR.test(event.url.pathname)) {
    return resolve(event, { ssr: false });
  }
  return resolve(event);
};

export const handle = sequence(
  handleSession({
    key: 'cbrn.spread',
    secret: 'tQFvVrst4gUcaWXkLwZ45hzJtRtNKSbX7RkkRQETnkFSxXMTuXJrJYKpysqz',
  }),
  customHandle,
);
