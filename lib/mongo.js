const MongoClient = require("mongodb").MongoClient;
const mongo = new MongoClient(process.env.mongoUrl, {
    useNewUrlParser: true
});

exports.connect = function() {
    return mongo.connect();
}
exports.close = function() {
    return mongo.close();
}

exports.mongo = mongo;