const HttpError = require("../lib/errors/HttpError");
const redis = require("../lib/redis");
const mongo = require("../lib/mongo");

module.exports = async function (req, res, next) {

    try {
        
        let result = await redis.getConfig(req.appId)[0];
        if(!result)
            result = await getAndCache(req.appId);
        
        if(!result)
            next(new HttpError("internal", "Unable to find application configuration", {appId: req.appId}));

        if(result._id !== req.appId)
            next(new HttpError("invalid-argument", "Requested appId does not match"));

        req.appConfig = result;

        next();

    } catch (error) {
        return next(error);
    }

}

async function getAndCache(appId) {
    try {
        const cfg = await mongo.getConfig(appId);
        redis.cacheConfig(cfg);

        return cfg;
    } catch (error) {
        throw error;
    }
}