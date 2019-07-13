const HttpError = require("../lib/errors/HttpError");
const redis = require("../lib/redis");

const permissionDenied = new HttpError("permission-denied", "Invalid API key or secret");

module.exports = async function (req, res, next) {

    try {

        const key = req.body.apiSecret || req.query.apiSecret;

        delete req.body.apiSecret;
        delete req.query.apiSecret;

        if (!key)
            return next(permissionDenied);

        const token = await redis.authenticateSecret(key);
        if (token === null)
            return next(permissionDenied);

        req.appId = token;
        next();

    } catch (error) {
        next(error);
    }
}