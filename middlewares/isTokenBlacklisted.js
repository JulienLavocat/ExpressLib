const HttpError = require("../lib/errors/HttpError");
const jwt = require("../lib/jwt");
const redis = require("../lib/redis");

const permissionDenied = new HttpError("permission-denied", "Invalid token");

//This function be replaced lately in favor of a bloom or a cuckoo filter in front of redis,
//Or maybe not, will see
//Currently we only enlist a jti, but why not add signature ?
module.exports = async function (req, res, next) {
    try {
        const token = (req.query.token || req.body.token)
        if (!token)
            throw permissionDenied;

        const decoded = jwt.decode(token);
        if(!decoded || !decoded.jti)
            throw permissionDenied;

        if (await redis.isTokenBlacklisted(decoded.jti))
            return next(permissionDenied);

        return next();
    } catch (error) {
        return next(error);
    }
}