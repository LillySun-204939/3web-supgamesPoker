var roomsModel = require('../Model/rooms');
var sessionsModel = require('../Model/sessions');
var pokerEngine = require('../Utils/pokerEngine');
module.exports = function (socket, io) {
    socket.on('play', function (data) {
        sessionsModel.get(data.session, function (err, session) {
            if (session) {
                roomsModel.get(data.room, function (err, room) {
                    if (room && pokerEngine.itsMyTurn(room, session.user._id)) {
                        var played = {
                            currentBet: '',
                            currentScore: '',
                            currentDone: []
                        };
                        if (data.action == 'fold') {
                            pokerEngine.play.fold(room, session.user._id);
                            io.sockets.to(data.room).emit('message', { username: session.user.username, message: '<strong class="fold">Fold</strong>'});

                        } else if (data.action == 'check' || (data.action == 'bet' && data['value'].length == 0)) {
                            pokerEngine.play.check(room, session.user._id);
                            io.sockets.to(data.room).emit('message', { username: session.user.username, message: '<strong class="check">Check</strong>'});
                        } else if (data.action == 'bet' && data['value'].length > 0) {
                            pokerEngine.play.bet(room, session.user._id, data.value);
                            io.sockets.to(data.room).emit('message', { username: session.user.username, message: '<strong class="bet">Bet with ' + data['value'] + '$ more.</strong>'});
                        }
                        played.currentBet = pokerEngine.getCurrentBetString(room);
                        played.currentDone = pokerEngine.getLastRound(room).cardsOnTable;
                        played.currentScore = pokerEngine.getCurrentScore(room);
                        io.sockets.to(data.room).emit('played', played);

                        //Todo: Send only when new done
                        pokerEngine.getLastRound(room).orderToPlay.forEach(function (userId) {
                            io.sockets.to(userId).emit('myCards', pokerEngine.getMyCards(room, userId)); //Different channel, safe way
                        });
                        roomsModel.update(room);

                    }
                });
            }
        });
    });
};