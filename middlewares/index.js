const validator = require("./validator");

module.exports = {
    apiKey: require("./apiKey"),
    apiSecret: require("./apiSecret"),
    validateBody: validator.body,
    validateQuery: validator.query,
    validate: validator.properties,
    jwt: require("./jwt"),
    needConfig: require("./needConfig"),
    isTokenBlacklisted: require("./isTokenBlacklisted")
};
