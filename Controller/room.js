var mvc = require('../Utils/mvc');
var tools = require('../Utils/tools');
var qs = require('querystring');
var url = require('url');
var modelRooms = require('../Model/rooms');
var modelMessages = require('../Model/messages');
var modelLanguages = require('../Model/languages');
var isMongoID = mvc.isValidMongoId;
var pokerEngine = require('../Utils/pokerEngine');
var roomController = {};

roomController.list = function (req, res) {
    modelRooms.list(function (err, rooms) {
        var output = {
            list: ''
        };
        var count = 0;
        rooms.forEach(function (entry) {
            var playerList = [];
            entry.players.forEach(function (player) {
                playerList.push(player.username);
            });

            output.list += '<tr>'
                + '<td>' + ++count + '</td>'
                + '<td>' + modelLanguages.getList()[entry.language] + '</td>'
                + '<td>' + entry.name + '</td>'
                + '<td>' + playerList.join(', ') + ' (' + playerList.length + '/4)</td>'
                + '<td><a href="/room/enter?id=' + entry._id + '"><button>Enter</button></a></td>'
                + '</tr>';
        });
        mvc.tempEnd(res, 'roomChoose', output);
    });
};

roomController.create = function (req, res) {
    var output = {
        return: '',
        form_name: '',
        language_list: modelLanguages.printSelect()
    };
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var post = qs.parse(body);
            output.form_name = post.name;
            output.language_list = modelLanguages.printSelect(post.language);
            if (!("name" in post) || post.name.length == 0) {
                output.return = '<p class="error">Name is empty</p>';
                mvc.tempEnd(res, 'roomNew', output);
            } else if (!("language" in post) || !modelLanguages.isKey(post.language)) {
                output.return = '<p class="error">Language is incorrect</p>';
                mvc.tempEnd(res, 'roomNew', output);
            } else {
                modelRooms.create(post.name, post.language, function (err, result) {
                    var head = {"Content-Type": "text/html"};
                    if (err) {
                        output.return = '<p class="error">Something failed.</p>'
                    } else {
                        head.Refresh = '2;url=/room/enter?id=' + result[0]._id;
                        output.return = '<p class="success">Creation successful.</p>';
                    }
                    mvc.tempEnd(res, 'roomNew', output, 200, head);
                });
            }
        });
    } else {
        mvc.tempEnd(res, 'roomNew', output);
    }
};

roomController.enter = function (req, res) {
    var output = {
        message: '',
        roomName: '',
        roomId: '',
        chat: '',
        currentbet: '',
        score: '<li>Not started</li>',
        mycards: '[]',
        deskcards: '[]'
    };
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (!('id' in query) || !isMongoID(query.id)) {
        output.message = '<p class="error">ID is not valid</p>';
        mvc.tempEnd(res, 'roomEnter', output);
    }

    modelRooms.addUser(query.id, req.userSession, function (isSuccess, room) {
        if (!isSuccess) {
            output.message = '<p class="error">Something failed.</p>';
            mvc.tempEnd(res, 'roomEnter', output);
        }
        var canStart = false;
        if (tools.size(room.players) == 4)
            canStart = true;

        if (canStart) {

            if (!('rounds' in room)) {
                pokerEngine.initGame(room);
                modelRooms.update(room); //Juste update DB.
            }
            output.score = pokerEngine.getCurrentScore(room);

            //Fill user cards
            var lastRound = pokerEngine.getLastRound(room);
            if (req.userSession.user._id in lastRound.roundPlayers) {
                var myCards = lastRound.roundPlayers[req.userSession.user._id].cards;
                output.mycards = '[\'' + myCards[0] + '\',\'' + myCards[1] + '\']';
            }

            //Fill desk cards
            var escapedCards = [];
            lastRound.cardsOnTable.forEach(function (card) {
                escapedCards.push('\'' + card + '\'');
            });
            output.deskcards = '[' + escapedCards.join() + ']';

            //Fill current Bet
            output.currentbet = pokerEngine.getCurrentBetString(room);

        }

        output.roomName = room.name;
        output.roomId = room._id;
        modelMessages.list(room, function (err, messages) {
            messages.forEach(function (message) {
                output.chat = '<li>' + message.user.username + ' : ' + message.message + '</li>' + output.chat;
            });
            mvc.tempEnd(res, 'roomEnter', output);
        });
    });
};

module.exports = roomController;