const HttpError = require("../HttpError");

module.exports = function (err) {

    switch (err.message) {
        case "jwt malformed":
            return new HttpError("invalid-argument", "Malformed token");
        case "invalid token":
            return new HttpError("invalid-argument", "Invalid token");
            
        default:
            return err;
    }

}