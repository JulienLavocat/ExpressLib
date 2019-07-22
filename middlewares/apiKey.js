const HttpError = require("../lib/errors/HttpError");
const redis = require("../lib/redis");

const permissionDenied = new HttpError("permission-denied", "Invalid API key or secret");

module.exports = async function (req, res, next) {

    try {

        const key = req.body.apiKey || req.query.apiKey;

        delete req.body.apiKey;
        delete req.query.apiKey;

        if (!key)
            return next(permissionDenied);

        const keyData = await redis.authenticateKey(key);
        if (keyData === null)
            return next(permissionDenied);

        req.apiKeyData = keyData;
        next();

    } catch (error) {
        next(error);
    }
}