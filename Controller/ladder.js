var mvc = require('../Utils/mvc');
var tools = require('../Utils/tools');
var url = require('url');
var modelRooms = require('../Model/rooms');

module.exports = function (req, res) {
    var params = {
        action: 'nbrGamesWon',
        order: 1
    };
    var query = url.parse(req.url, true).query;
    if ('by' in query
        && ['timePlayed',
        'nbrGamesDone',
        'avgGamesDuration',
        'nbrGamesWon',
        'nbrRoundsBeforeWin',
        'nbrRoundsBeforeLoose'].indexOf(query.by) > -1)
        params.action = query.by;
    if ('order' in query && [-1, 1].indexOf(parseInt(query.order)) > -1)
        params.order = parseInt(query.order);
    var output = {
        array: ''
    };
    switch (params.action) {
        case 'timePlayed':
            output.array = '<thead><th>Player</th><th>Time played</th></thead>';
            modelRooms.getTimePlayed(params.order, function (err, result) {
                output.array += '<tbody>';
                result.forEach(function (row) {
                    output.array += '<tr><td>' + row._id.username + '</td><td>' + tools.millisecondsToStr(row.duration) + '</td></tr>';
                });
                output.array += '</tbody>';
                mvc.tempEnd(res, 'ladder', output);
            });
            break;
        case 'nbrGamesDone':
            output.array = '<thead><th>Player</th><th>Number of games done</th></thead>';
            modelRooms.getNbrDone(params.order, function (err, result) {
                output.array += '<tbody>';
                result.forEach(function (row) {
                    output.array += '<tr><td>' + row._id.username + '</td><td>' + row.nbrGame + '</td></tr>';
                });
                output.array += '</tbody>';
                mvc.tempEnd(res, 'ladder', output);
            });
            break;
        case 'avgGamesDuration':
            output.array = '<thead><th>Player</th><th>Average of duration for a game</th></thead>';
            modelRooms.getAvgDuration(params.order, function (err, result) {
                output.array += '<tbody>';
                result.forEach(function (row) {
                    output.array += '<tr><td>' + row._id.username + '</td><td>' + tools.millisecondsToStr(row.duration) + '</td></tr>';
                });
                output.array += '</tbody>';
                mvc.tempEnd(res, 'ladder', output);
            });
            break;
        case 'nbrRoundsBeforeWin':
            output.array = '<thead><th>Player</th><th>Number of rounds before win</th></thead>';
            modelRooms.getNbrRoundsBeforeWin(params.order, function (err, result) {
                output.array += '<tbody>';
                result.forEach(function (row) {
                    output.array += '<tr><td>' + row._id.username + '</td><td>' + row.avgRounds + '</td></tr>';
                });
                output.array += '</tbody>';
                mvc.tempEnd(res, 'ladder', output);
            });
            break;
        case 'nbrRoundsBeforeLoose':
            output.array = '<thead><th>Player</th><th>Number of rounds before loose</th></thead>';
            modelRooms.getNbrRoundsBeforeLoose(params.order, function (err, result) {
                output.array += '<tbody>';
                result.forEach(function (row) {
                    output.array += '<tr><td>' + row._id.username + '</td><td>' + row.avgRounds + '</td></tr>';
                });
                output.array += '</tbody>';
                mvc.tempEnd(res, 'ladder', output);
            });
            break;
        case 'nbrGamesWon':
        default:
            output.array = '<thead><th>Player</th><th>Number of won</th></thead>';
            modelRooms.getNbrWon(params.order, function (err, result) {
                output.array += '<tbody>';
                result.forEach(function (row) {
                    output.array += '<tr><td>' + row._id.username + '</td><td>' + row.nbrWon + '</td></tr>';
                });
                output.array += '</tbody>';
                mvc.tempEnd(res, 'ladder', output);
            });
            break;

    }

    /*
     modelRooms.getAvgDuration(req.userSession.user._id, function(errAvgDuration, resultAvgDuration) {
     if (resultAvgDuration.length == 1)
     output.avgRoomDuration = resultAvgDuration[0].duration;
     modelRooms.getNbrWon(req.userSession.user._id, function(errNbrWon, resultNbrWon) {
     if (resultNbrWon.length == 1)
     output.nbrRoomWon = resultNbrWon[0].nbrWon;
     modelRooms.getNbrRoundsBeforeWin(req.userSession.user._id, function(errNbrRoundsBeforeWin, resultNbrRoundsBeforeWin) {
     if (resultNbrRoundsBeforeWin.length == 1)
     output.nbrRoundBeforeWin = resultNbrRoundsBeforeWin[0].avgRounds;
     modelRooms.getNbrRoundsBeforeLoose(req.userSession.user._id, function(errNbrRoundsBeforeLoose, resultNbrRoundsBeforeLoose) {
     if (resultNbrRoundsBeforeLoose.length == 1)
     output.nbrRoundBeforeLoose = resultNbrRoundsBeforeLoose[0].avgRounds;
     output.timePlayed = tools.millisecondsToStr(output.timePlayed);
     output.avgRoomDuration = tools.millisecondsToStr(output.avgRoomDuration);

     });
     });
     });
     });
     });*/
};