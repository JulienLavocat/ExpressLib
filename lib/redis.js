const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
const redis = new Redis(conData[1], conData[0], {
    lazyConnect: true,
    password: process.env.redisAuth
});

const TOKENS_PREFIX = process.env.tokensPrefix;
const BL_KEYS_PREFIX = process.env.blTokenPrefix;

const APPCONFIG_PREFIX = process.env.appCfgPrefix;
const APPCONFIG_TTL = process.env.appCfgTtl;

exports.connect = function () {
    return redis.connect();
}
exports.isTokenBlacklisted = async function(jti) {
    return (await redis.exists(BL_KEYS_PREFIX + jti)) === 1;
}
exports.authenticateKey = function(apiKey) {
    return redis.get(TOKENS_PREFIX + "key." + apiKey);
}
exports.authenticateSecret = function(apiKey) {
    return redis.get(TOKENS_PREFIX + "secret." + apiKey);
}
exports.getConfig = function(appId) {
    return redis.multi()
        .get(APPCONFIG_PREFIX + appId)
        .expire(APPCONFIG_PREFIX + appId, APPCONFIG_TTL)
        .exec();
}
exports.cacheConfig = function(appId, cfg) {
    return redis.set(APPCONFIG_PREFIX + appId, cfg, "EX", APPCONFIG_TTL);
}
exports.close = function() {
    return new Promise(function(resolve, reject) {
        console.log("Exiting redis");
        redis.disconnect();
        resolve();
    });
}

exports.redis = redis;