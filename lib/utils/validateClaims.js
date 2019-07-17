const HttpError = require("../errors/HttpError");
const permissionDenied = new HttpError("permission-denied", "Invalid token");

module.exports = function (claims, token) {
    const entries = Object.entries(claims);

    for(let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        const value = claims[entry[0]];

        if(!value || value !== entry[1])
            throw permissionDenied;
    }

}