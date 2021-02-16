import redis from 'redis';
const port = process.env.PORT || (6379 as any); // in prod either cast port as unknown then as number or parseInt(process?.env?.PORT!)
export const redisClient = redis.createClient(port);
