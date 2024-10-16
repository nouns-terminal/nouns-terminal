import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']).default('info'),
  DATADOG_API_KEY: z.string().optional(),
  AIRSTACK_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().startsWith('postgresql://'),
  PROVIDER_URL: z.string().transform((v) => v.split(',')),
  PORT: z.coerce.number().default(3003),
  GENESIS_BLOCK: z.coerce.number().default(12985450),
  AUTHORS: z
    .string()
    .default('')
    .transform((v) => v.trim().toLowerCase().split(',')),
});

export default envSchema.parse(process.env);
