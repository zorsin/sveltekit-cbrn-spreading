import { create } from 'twind';
import { virtualSheet, getStyleTag, shim } from 'twind/shim/server';
import twindConfig from '$lib/twind.config';
const sheet = virtualSheet();
const { tw } = create({ ...twindConfig, sheet });
sheet.reset();

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }): Promise<Response> {
  const response = await resolve(event);

  if (response.headers.get('content-type')?.startsWith('text/html')) {
    const body = await response.text();
    const shimedBody = shim(body, { tw });
    const style = getStyleTag(sheet);
    const final = shimedBody.replace(/<\/head>/g, `${style}</head>`);
    return new Response(final, response);
  }
  return response;
}
