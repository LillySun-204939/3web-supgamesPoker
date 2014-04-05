var roomsModel = require('../Model/rooms');
var sessionsModel = require('../Model/sessions');
module.exports = function (io) {
    io.sockets.on('connection', function (socket) {
        socket.on('subscribe', function (data) {
            sessionsModel.get(data.session, function (err, session) {
                if (session) {
                    roomsModel.get(data.room, function (err, room) {
                        if (room) {
                            socket.join(session.user._id)
                            socket.join(room._id);
                        }
                    });
                }
            });
        });
        require('../Controller/chatSocket')(socket, io);
        require('../Controller/roomSocket')(socket, io);
    });
};