import { ZodSchema } from 'zod';

export function validate<T>(schema: ZodSchema<T>, payload: unknown): T {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const errorMessages = result.error.issues.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }
  return result.data;
}