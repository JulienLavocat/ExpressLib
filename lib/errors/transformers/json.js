const HttpError = require("../HttpError");

module.exports = function (err) {

    const msgs = [];

    err.validationErrors.body.forEach(element => {
        msgs.push({
            field: element.dataPath.substring(1),
            error: element.message
        });
    });

    return new HttpError("invalid-argument", "Invalid paylaod", msgs);
}