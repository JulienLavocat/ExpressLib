const server = require("./lib/server");

module.exports = {
    start: server.start,
    use: server.use,
    setErrorHandler: server.setErrorHandler,
    express: server.app,
    router: require("express").Router,
    redis: require("./lib/redis").redis,
    mongodb: require("./lib/mongo").mongo,
    middlewares: require("./middlewares"),
    HttpError: require("./lib/HttpError")
};