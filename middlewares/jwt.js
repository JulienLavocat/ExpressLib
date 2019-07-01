const HttpError = require("../lib/errors/HttpError");
const jwt = require("../lib/jwt");

const permissionDenied = new HttpError("permission-denied", "Invalid token");

module.exports = async function (req, res, next) {
    try {
        
        const token = req.body.token || req.query.token;
        if(!token)
            throw permissionDenied;

        const claims = await jwt.verify(token);
        req.jwt = claims;
        return next();

    } catch (error) {
        return next(error);
    }
}