const HttpError = require("../lib/errors/HttpError");
const jwt = require("../lib/jwt");

const permissionDenied = new HttpError("permission-denied", "Invalid token");

module.exports = async function (req, res, next) {
    try {
        const token = req.body.token || req.query.token;

        delete req.body.token;
        delete req.query.token;

        if (!token)
            return next(permissionDenied);

        const claims = await jwt.verify(token);

        if (!claims || !claims.jti)
            return next(permissionDenied);

        if (await redis.isTokenBlacklisted(claims.jti))
            return next(permissionDenied);

        req.jwt = claims;
        return next();

    } catch (error) {
        return next(error);
    }
}