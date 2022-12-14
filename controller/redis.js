
const redis = require("redis");

const { promisify } = require("util");

//1. Connect to the redis server
const redisClient = redis.createClient(
  16229,
  "redis-16229.c212.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("znaLjzm6rykCQV9nqY3cqire54HyQqdB", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});


//2. Prepare the functions for each command

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


module.exports={SET_ASYNC,GET_ASYNC}

// const fetchAuthorProfile = async function (req, res) {

// //3. Start using the redis commad
//   let cahcedProfileData = await GET_ASYNC(`${req.params.authorId}`)
//   if(cahcedProfileData) {
//     res.send(cahcedProfileData)
//   } else {
//     let profile = await authorModel.findById(req.params.authorId);
//     await SET_ASYNC(`${req.params.authorId}`, JSON.stringify(profile))
//     res.send({ data: profile });
//   }

// };

// module.exports.createAuthor = createAuthor;
// module.exports.fetchAuthorProfile = fetchAuthorProfile;
