const server = require("./lib/server");

module.exports = {
    start: server.start,
    use: server.use,
    setErrorHandler: server.setErrorHandler,
    express: server.app,
    terminus: require("./lib/terminus"),
    router: require("express").Router,
    redis: require("./lib/redis").redis,
    mongodb: require("./lib/mongo").mongo,
    middlewares: require("./middlewares"),
    HttpError: require("./lib/errors/HttpError"),
    jwt: require("./lib/jwt"),
    utils: require("./lib/utils")
};