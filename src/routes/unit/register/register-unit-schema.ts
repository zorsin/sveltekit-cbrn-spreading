import { z } from 'zod';

export const registerUnitSchema = z.object({
  radio: z.string().min(1, { message: 'errors.radio' }),
  vehicle: z.string().min(1, { message: 'errors.vehicle' }),
  crew: z.string().min(1, { message: 'errors.crew' }),
  missionUuid: z.string().min(1, { message: 'errors.missionUuid' }),
});
