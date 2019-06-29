const HttpError = require("../HttpError");

module.exports = function (err) {
    return new HttpError("invalid-argument", "Token expired");
}