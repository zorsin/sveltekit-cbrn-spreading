import { z } from 'zod';

const pointRegex = new RegExp(/^(-?\d{1,3}(\.\d+)?),\s(-?\d{1,3}(\.\d+)?)$/g);
export enum SpreadModes {
  ellipse = 'ellipse',
  triangle = 'triangle',
}

const defaultSpreadValidation = {
  start: z.string().regex(pointRegex, { message: 'errors.start' }),
  mode: z.nativeEnum(SpreadModes),
  length: z.number().min(1, { message: 'errors.minLength' }).max(10000, { message: 'errors.maxLength' }),
  width: z.number().min(1, { message: 'errors.minLength' }).max(10000, { message: 'errors.maxLength' }),
  angle: z.number().min(0, { message: 'errors.minAngle' }).max(360, { message: 'errors.maxAngle' }),
  openingAngle: z.number().min(1, { message: 'errors.minOpeningAngle' }).max(180, { message: 'errors.maxOpeningAngle' }),
  strength: z.number().min(1, { message: 'errors.minStrength' }),
  showStrength: z.boolean(),
};

export const spreadSchema = z.object({
  start: defaultSpreadValidation.start.default('49.1273755, 9.2176877'),
  mode: defaultSpreadValidation.mode.default(SpreadModes.ellipse),
  length: defaultSpreadValidation.length.default(1000),
  width: defaultSpreadValidation.width.default(500),
  angle: defaultSpreadValidation.angle.default(0),
  openingAngle: defaultSpreadValidation.openingAngle.default(45),
  strength: defaultSpreadValidation.strength.default(50000),
  showStrength: defaultSpreadValidation.showStrength.default(false),
});
export const saveSpreadSchema = z.object({ name: z.string().min(3, { message: 'errors.minName' }), ...defaultSpreadValidation });
