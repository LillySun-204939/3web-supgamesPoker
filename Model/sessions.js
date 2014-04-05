var collectionName = "sessions";
var BSON = require('mongodb').BSONPure;
var sessionsModel = {};

sessionsModel.create = function (user, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var now = new Date();
        var tokenExpire = new Date(now.getTime() + (1000 * require('../config').tokenExpire));
        var data = {
            expirationDate: tokenExpire,
            user: {
                _id: user._id,
                username: user.username
            }
        };
        collection.insert(data, function (err, result) {
            callback(err, result);
        });
    });
};

sessionsModel.get = function (id, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var o_id = new BSON.ObjectID(id);
        collection.findOne({_id: o_id}, function (err, session) {
            callback(err, session);
        });
    });
};

module.exports = sessionsModel;