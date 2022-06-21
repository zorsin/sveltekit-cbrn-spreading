import handleTwind from '@twind/with-sveltekit/hooks';
import { handleSession } from 'svelte-kit-cookie-session';
import { sequence } from '@sveltejs/kit/hooks';

export const getSession = ({request}) => {
  let acceptedLanguage = request.headers["accept-language"] && request.headers["accept-language"].split(',')[0];
  return { acceptedLanguage };
}

/** @type {import('@sveltejs/kit').Handle} */
const customHandle = async ({ event, resolve }) => {
  return resolve(event);
};

export const handle = sequence(handleSession({
  secret: "tQFvVrst4gUcaWXkLwZ45hzJtRtNKSbX7RkkRQETnkFSxXMTuXJrJYKpysqz"
}),handleTwind(), customHandle);
