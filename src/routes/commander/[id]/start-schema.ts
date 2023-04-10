import { z } from 'zod';

export const startSchema = z.object({
  code: z
    .string()
    .min(5, { message: 'errors.minCode' })
    .regex(/^[a-zA-Z0-9]+$/g, { message: 'errors.code' }),
  angle: z.number(),
  length: z.number(),
  name: z.string(),
  start: z.string().transform((val) => {
    const [x, y] = val.split(',');
    return [parseFloat(x), parseFloat(y)];
  }),
  strength: z.number(),
  uuid: z.string(),
  width: z.number(),
  mode: z.string(),
  openingAngle: z.number(),
});
