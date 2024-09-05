// server.js
const express = require('express');
const redis = require('redis');

const app = express();
const PORT = 3000;

// Connect to Redis
const client = redis.createClient({
  host: 'redis',
  port: 6379
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

client.on('connect', () => {
  console.log('Connected to Redis');
});

// Middleware for cache
const cache = (req, res, next) => {
  const { key } = req.params;

  client.get(key, (err, data) => {
    if (err) throw err;
    if (data) {
      res.send(`Cached data: ${data}`);
    } else {
      next();
    }
  });
};

// Route to cache data
app.get('/data/:key', cache, (req, res) => {
  const { key } = req.params;
  const value = `Data for ${key}`;

  client.setex(key, 3600, value); // Cache for 1 hour
  res.send(`New data: ${value}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
