// redis.js
require("dotenv").config(); // Load environment variables
const Redis = require('ioredis');

// Initialize Redis using environment variables (from .env file)
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null,
});

module.exports = redis;