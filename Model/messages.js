var collectionName = "messages";
var BSON = require('mongodb').BSONPure;
var messagesModel = {};

messagesModel.create = function (room, user, content, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var data = {
            room: {
                _id: room._id,
                name: room.name,
                language: room.language
            },
            user: {
                _id: user._id,
                username: user.username
            },
            message: content,
            createdAt: new Date()
        };
        collection.insert(data, function (err, result) {
            callback(err, result);
        });
    });
};

messagesModel.list = function (room, callback) {
    global.db.collection(collectionName, { w: 0 }, function (err, collection) {
        collection.find({'room._id': room._id}, function (err, cursor) {
            cursor.toArray(function (err, rooms) {
                callback(err, rooms);
            });
        });
    });
};

module.exports = messagesModel;