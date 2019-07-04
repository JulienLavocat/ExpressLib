const MongoClient = require("mongodb").MongoClient;
const mongo = new MongoClient(process.env.mongoUrl, {
    useNewUrlParser: true
});

exports.connect = function() {
    return mongo.connect();
}
exports.getConfig = function(appId) {
    return mongo.db("gamedb").collection("configs").findOne({_id: appId});
}
exports.close = function() {
    return mongo.close();
}

exports.mongo = mongo;