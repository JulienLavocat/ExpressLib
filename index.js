module.exports = {
    start: require("./server").start,
    express = require("./server").app,
    redis: require("./lib/redis"),
    mongodb: require("./lib/mongo"),
    middlewares = require("./middlewares")
};