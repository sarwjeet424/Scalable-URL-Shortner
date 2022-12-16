const redis = require("redis");

const { promisify } = require("util");

//1. Connect to the redis server
const redisClient = redis.createClient(
   16229,
  "redis-16229.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("xest3pC118Sn1P6qAjXUadLzqELXLZzk", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function() {
  console.log("Connected to Redis.");
});


//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SETEX).bind(redisClient);    // bind() is the function of javascript
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);      


module.exports={SET_ASYNC,GET_ASYNC}


