import { createClient, RedisClientType } from 'redis';

const redisURL = process.env.REDIS_URL;

const redisClient: RedisClientType = createClient({
    url: redisURL, // Adjust the URL as needed
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    await redisClient.connect();
})();

export default redisClient;
