const HttpError = require("../lib/errors/HttpError");
const redis = require("../lib/redis");

module.exports = async function (req, res, next) {

    try {
        
        const key = req.body.apiKey || req.query.apiKey;

        delete req.body.apiKey;
        delete req.query.apiKey;

        if(!key)
            throw new HttpError("permission-denied", "Invalid API key");
        
        const keyData = await redis.authenticateKey(key);
        if(keyData === null)
            throw new HttpError("permission-denied", "Invalid API key");

        req.appId = keyData;
        next();

    } catch (error) {
        next(error);
    }
}