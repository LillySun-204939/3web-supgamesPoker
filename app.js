var http = require('http');
var mongoClient = require('mongodb').MongoClient;

mongoClient.connect(require('./config').db, function (err, db) {
    if (!err) {
        global.db = db;
        console.log("Connected to MongoDB");
    } else {
        console.log(err);
    }
});

var server = http.createServer(function (req, res) {
    require('./Utils/routes')(req, res);
});

var io = require('socket.io').listen(server);
io.set('log level', 1);
require('./Utils/routesSocket')(io);

server.listen(1337);