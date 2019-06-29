const HttpError = require("../HttpError");

module.exports = function (err) {
    if (err.message.startsWith("E11000"))
        return new HttpError("invalid-argument", extractDuplicateKey(err.message));
    return err;
}

function extractDuplicateKey(msg) {
    let index = msg.split("index:")[1].split(" ")[1];
    return `${index} already exist`;
}