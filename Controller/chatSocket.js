var roomsModel = require('../Model/rooms');
var sessionsModel = require('../Model/sessions');
var messagesModel = require('../Model/messages');
module.exports = function (socket, io) {
    socket.on('sendMessage', function (data) {
        if (data.message) {
            sessionsModel.get(data.session, function (err, session) {
                if (session) {
                    roomsModel.get(data.room, function (err, room) {
                        if (room) {
                            messagesModel.create(room, session.user, data.message, function () {
                                //Todo : Broadcast
                                io.sockets.to(data.room).emit('message', { username: session.user.username, message: data.message});
                            });
                        }
                    });
                }
            });
        }
    });
};