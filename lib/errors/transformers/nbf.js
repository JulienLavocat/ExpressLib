const HttpError = require("../HttpError");

module.exports = function (err) {
    return new HttpError("permission-denied", "Token can't be used before", {notBefore: err.date});
}