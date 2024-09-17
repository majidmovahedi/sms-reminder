import { createClient, RedisClientType } from 'redis';

const redisClient: RedisClientType = createClient({
    url: 'redis://localhost:6379', // Adjust the URL as needed
});

redisClient.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    await redisClient.connect();
})();

export default redisClient;
