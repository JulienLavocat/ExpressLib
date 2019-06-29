const HttpError = require("../HttpError");

module.exports = function (err) {

    switch (err.message) {
        case "jwt malformed":
            return new HttpError("invalid-argument", "Malformed token");
    
        default:
            return err;
    }

}