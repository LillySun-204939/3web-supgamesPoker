var collectionName = "rooms";
var BSON = require('mongodb').BSONPure;
var roomsModel = {};
var tools = require('../Utils/tools');

roomsModel.create = function (name, language, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var data = {
            name: name,
            language: language,
            createdAt: new Date(),
            players: []
        };
        collection.insert(data, function (err, result) {
            callback(err, result);
        });
    });
};

roomsModel.update = function (room) {
    global.db.collection(collectionName, function (err, collection) {
        collection.save(room, {w: 0});
    });
};

roomsModel.list = function (callback) {
    global.db.collection(collectionName, function (err, collection) {
        collection.find({endedAt: {$exists: false}}, function (err, cursor) {
            cursor.toArray(function (err, rooms) {
                callback(err, rooms);
            });
        });
    });
};

roomsModel.addUser = function (room, session, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var o_id = new BSON.ObjectID(room);
        collection.findOne({_id: o_id}, function (err, room) {
            if (typeof tools.getEntryById(room.players, session.user._id) != 'undefined') {
                callback(true, room);
                return;
            }
            if (room.players.length > 3) {
                callback(false, room);
                return;
            }
            room.players.push(session.user);
            collection.save(room, {w: 1}, function (err, result) { //write concerns
                if (result) {
                    callback(true, room);
                } else {
                    callback(false, room);
                }
            });
        });
    });
};

roomsModel.get = function (id, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var o_id = new BSON.ObjectID(id);
        collection.findOne({_id: o_id}, function (err, room) {
            callback(err, room);
        });
    });
};

roomsModel.get = function (id, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var o_id = new BSON.ObjectID(id);
        collection.findOne({_id: o_id}, function (err, room) {
            callback(err, room);
        });
    });
};

roomsModel.getTimePlayed = function () {
    var args = Array.prototype.slice.call(arguments);
    var id;
    var order;
    var callback;
    args.forEach(function (arg) {
        if (typeof arg == "function") {
            callback = arg;
        } else if (typeof arg == "number" || typeof arg == "boolean") {
            order = arg;
        } else {
            id = arg;
        }
    });
    global.db.collection(collectionName, function (err, collection) {

        var query = [];
        query.push({ $unwind: "$players" });
        query.push({ $project: { _id: {_id: '$players._id', username: '$players.username'}, duration: 1 } });
        if (typeof id != 'undefined')
            query.push({ $match: { "_id._id": id} });
        query.push({ $group: { _id: "$_id", duration: { $sum: "$duration" } } });
        if (typeof order != 'undefined')
            query.push({ $sort: { duration: order } });
        collection.aggregate(query, function (err, result) {
                callback(err, result);
            }
        )
    });
};

roomsModel.getNbrDone = function () {
    var args = Array.prototype.slice.call(arguments);
    var id;
    var order;
    var callback;
    args.forEach(function (arg) {
        if (typeof arg == "function") {
            callback = arg;
        } else if (typeof arg == "number" || typeof arg == "boolean") {
            order = arg;
        } else {
            id = arg;
        }
    });
    global.db.collection(collectionName, function (err, collection) {

        var query = [];
        query.push({ $unwind: "$players" });
        query.push({ $project: { _id: {_id: '$players._id', username: '$players.username'} } });
        if (typeof id != 'undefined')
            query.push({ $match: { "_id._id": id} });
        query.push({ $group: { _id: "$_id", nbrGame: { $sum: 1 } } });
        if (typeof order != 'undefined')
            query.push({ $sort: { nbrGame: order } });
        collection.aggregate(query, function (err, result) {
                callback(err, result);
            }
        )
    });
};

roomsModel.getAvgDuration = function () {
    var args = Array.prototype.slice.call(arguments);
    var id;
    var order;
    var callback;
    args.forEach(function (arg) {
        if (typeof arg == "function") {
            callback = arg;
        } else if (typeof arg == "number" || typeof arg == "boolean") {
            order = arg;
        } else {
            id = arg;
        }
    });
    global.db.collection(collectionName, function (err, collection) {
        var query = [];
        query.push({ $unwind: "$players" });
        query.push({ $project: { _id: {_id: '$players._id', username: '$players.username'}, duration: 1 } });
        if (typeof id != 'undefined')
            query.push({ $match: { "_id._id": id} });
        query.push({ $group: { _id: "$_id", duration: { $avg: "$duration" } } });
        if (typeof order != 'undefined')
            query.push({ $sort: { duration: order } });
        collection.aggregate(query, function (err, result) {
                callback(err, result);
            }
        )
    });
};

roomsModel.getNbrWon = function () {
    var args = Array.prototype.slice.call(arguments);
    var id;
    var order;
    var callback;
    args.forEach(function (arg) {
        if (typeof arg == "function") {
            callback = arg;
        } else if (typeof arg == "number" || typeof arg == "boolean") {
            order = arg;
        } else {
            id = arg;
        }
    });
    global.db.collection(collectionName, function (err, collection) {
        var query = [];
        var match = {
            money: 400
        };

        query.push({ $unwind: "$players" });
        query.push({ $project: { _id: {_id: '$players._id', username: '$players.username'}, money: '$players.money', duration: 1 } });
        if (typeof id != 'undefined')
            match['_id._id'] = id;
        query.push({ $match: match });
        query.push({ $group: { _id: "$_id", nbrWon: { $sum: 1 } } });
        if (typeof order != 'undefined')
            query.push({ $sort: { nbrWon: order } });
        collection.aggregate(query, function (err, result) {
                callback(err, result);
            }
        )
    });
};

roomsModel.getNbrRoundsBeforeWin = function () {
    var args = Array.prototype.slice.call(arguments);
    var id;
    var order;
    var callback;
    args.forEach(function (arg) {
        if (typeof arg == "function") {
            callback = arg;
        } else if (typeof arg == "number" || typeof arg == "boolean") {
            order = arg;
        } else {
            id = arg;
        }
    });
    global.db.collection(collectionName, function (err, collection) {
        var query = [];
        var match = {
            money: 400
        };

        query.push({ $unwind: "$players" });
        query.push({ $project: { _id: {_id: '$players._id', username: '$players.username'}, money: '$players.money', rounds: '$players.rounds'} });
        if (typeof id != 'undefined')
            match['_id._id'] = id;
        query.push({ $match: match });
        query.push({ $group: { _id: "$_id", avgRounds: { $avg: "$rounds" } } });
        if (typeof order != 'undefined')
            query.push({ $sort: { avgRounds: order } });
        collection.aggregate(query, function (err, result) {
                callback(err, result);
            }
        )
    });
};

roomsModel.getNbrRoundsBeforeLoose = function () {
    var args = Array.prototype.slice.call(arguments);
    var id;
    var order;
    var callback;
    args.forEach(function (arg) {
        if (typeof arg == "function") {
            callback = arg;
        } else if (typeof arg == "number" || typeof arg == "boolean") {
            order = arg;
        } else {
            id = arg;
        }
    });
    global.db.collection(collectionName, function (err, collection) {
        var query = [];
        var match = {
            money: 0
        };

        query.push({ $unwind: "$players" });
        query.push({ $project: { _id: {_id: '$players._id', username: '$players.username'}, money: '$players.money', rounds: '$players.rounds'} });
        if (typeof id != 'undefined')
            match['_id._id'] = id;
        query.push({ $match: match });
        query.push({ $group: { _id: "$_id", avgRounds: { $avg: "$rounds" } } });
        if (typeof order != 'undefined')
            query.push({ $sort: { avgRounds: order } });
        collection.aggregate(query, function (err, result) {
                callback(err, result);
            }
        )
    });
};

module.exports = roomsModel;