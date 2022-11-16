const Redis = require("ioredis");
const redis = new Redis({
  port: 14812,
  host: "redis-14812.c8.us-east-1-4.ec2.cloud.redislabs.com", // Redis host
  username: "default", 
  password: process.env.REDIS_PASSWORD,
});

module.exports = redis