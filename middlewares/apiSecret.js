const HttpError = require("../lib/errors/HttpError");
const redis = require("../lib/redis");

module.exports = async function (req, res, next) {

    try {
        
        const key = req.body.apiSecret || req.query.apiSecret;
        
        delete req.body.apiSecret;
        delete req.query.apiSecret;

        if(!key)
            throw new HttpError("permission-denied", "Invalid API key");
        
        const token = await redis.authenticateSecret(key);
        if(token === null)
            throw new HttpError("permission-denied", "Invalid API key");

        req.appId = token;
        next();

    } catch (error) {
        next(error);
    }
}