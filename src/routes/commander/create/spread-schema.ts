import { z } from 'zod';

const pointRegex = new RegExp(/^(\d+(\.\d+)?),\s(\d+(\.\d+)?)$/g);
export enum SpreadModes {
  ellipse = 'ellipse',
  triangle = 'triangle',
}

export const spreadSchema = z.object({
  start: z.string().regex(pointRegex, { message: 'errors.start' }).default('49.1273755, 9.2176877'),
  mode: z.nativeEnum(SpreadModes).default(SpreadModes.ellipse),
  length: z.number().min(1, { message: 'errors.minLength' }).max(10000, { message: 'errors.maxLength' }).default(1000),
  width: z.number().min(1, { message: 'errors.minLength' }).max(10000, { message: 'errors.maxLength' }).default(1000),
  angle: z.number().min(0, { message: 'errors.minAngle' }).max(360, { message: 'errors.maxAngle' }).default(0),
  openingAngle: z.number().min(1, { message: 'errors.minOpeningAngle' }).max(180, { message: 'errors.maxOpeningAngle' }).default(45),
  strength: z.number().min(1, { message: 'errors.minStrength' }).default(50000),
  showStrength: z.boolean().default(false),
});
