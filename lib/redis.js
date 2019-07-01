const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
const redis = new Redis(conData[1], conData[0], {
    lazyConnect: true,
    password: process.env.redisAuth
});

const TOKENS_PREFIX = "tokens.";

exports.authenticateKey = function(apiKey) {
    return redis.get(TOKENS_PREFIX + "key." + apiKey);
}
exports.authenticateSecret = function(apiKey) {
    return redis.get(TOKENS_PREFIX + "secret." + apiKey);
}
exports.connect = function () {
    return redis.connect();
}
exports.close = function() {
    return new Promise(function(resolve, reject) {
        console.log("Exiting redis");
        resolve();
    });
}

exports.redis = redis;