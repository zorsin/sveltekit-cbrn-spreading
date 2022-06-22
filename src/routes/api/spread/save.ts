import { connect, close } from '$lib/logic/mongo';

export const post = async ({ request }) => {
  const body = await request.json();
  const collection = await connect('spread');
  const insertResult = await collection.insertOne({
    name: body.name,
    start: body.start,
    width: body.width,
    length: body.length,
    angle: body.angle,
    strength: body.strength,
  });
  // TODO: generate a token for the user
  close();
  return {
    status: 200,
    body: {
      id: insertResult.insertedId,
    },
  };
};
