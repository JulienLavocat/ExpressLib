const Redis = require("ioredis");

const conData = process.env.redisUrl.split(":");
<<<<<<< HEAD
const redis = new Redis(connData[1], connData[0], {lazyConnect: true});
=======
const redis = new Redis(conData[1], conData[0], {lazyConnect: true, password: process.env.redisAuth});
>>>>>>> 56321fbc403b6562f34063abf78b166c006882be

const TOKENS_PREFIX = "tokens.";

module.exports = class Redis {
    
    static authenticateKey(apiKey) {
        return redis.get(TOKENS_PREFIX + "key." + apiKey);
    }

    static authenticateSecret(apiKey) {
        return redis.get(TOKENS_PREFIX + "secret." + apiKey);
    }

    static connect() {
        return redis.connect();
    }

}