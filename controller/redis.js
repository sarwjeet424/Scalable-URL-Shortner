const redis = require("redis");
const { promisify } = require("util");

//1. Connect to the redis server
const redisClient = redis.createClient(
  19618,
  "redis-19618.c114.us-east-1-4.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("D32TNENjB9Z57bbLuRzmgAfeMLpISfPL", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


module.exports={SET_ASYNC,GET_ASYNC}













//cashe data --->   token 

//