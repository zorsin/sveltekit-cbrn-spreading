import type { RequestHandler } from './__types/index';
import { connect, close } from '$lib/logic/mongo';

export const del: RequestHandler = async ({ locals, url }) => {
  const uuid = url.searchParams.get('id');
  try {
    const collection = await connect('spread');
    const deleteResult = await collection.deleteOne({
      uuid,
    });
    if (!deleteResult?.acknowledged) {
      return {
        status: 503,
        body: { msg: 'errors.delete-not-successful' },
      };
    }
  } catch (e) {
    console.error('Error while deleting', e);
    return {
      status: 503,
      body: { msg: 'errors.delete-not-successful' },
    };
  }
  close();

  // delete also from cookie
  await locals.session.update(({ recentSpreads }) => {
    let currentSpread = recentSpreads;
    // keep max

    currentSpread = currentSpread.filter((value) => value.id !== uuid);

    return {
      recentSpreads: [...currentSpread],
    };
  });

  return {
    status: 202,
  };
};
