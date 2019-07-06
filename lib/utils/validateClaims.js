const HttpError = require("../errors/HttpError");
const permissionDenied = new HttpError("permission-denied", "Invalid token");

module.exports = function (claims, data) {
    const entries = Object.entries(data);
    for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const key = claims[entry[0]];

        if (key === null)
            throw permissionDenied;
        if (key !== entry[1])
            throw permissionDenied;

    }
}