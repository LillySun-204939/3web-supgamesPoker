var mvc = require('../Utils/mvc');
var tools = require('../Utils/tools');
var qs = require('querystring');
var modelSessions = require('../Model/sessions');
var modelUsers = require('../Model/users');
var modelRooms = require('../Model/rooms');
var modelLanguages = require('../Model/languages');
var userController = {};
userController.registration = function (req, res) {
    var output = {
        return: '',
        form_username: '',
        form_password: '',
        language_list: modelLanguages.printSelect()
    };
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var post = qs.parse(body);
            output.form_password = post.password;
            output.form_username = post.username;
            output.language_list = modelLanguages.printSelect(post.language);
            if (!("username" in post) || post.username.length == 0) {
                output.return = '<p class="error">Username is empty</p>';
                mvc.tempEnd(res, 'registration', output);
            } else if (!("password" in post) || post.password.length == 0) {
                output.return = '<p class="error">Password is empty</p>';
                mvc.tempEnd(res, 'registration', output);
            } else if (!("language" in post) || !modelLanguages.isKey(post.language)) {
                output.return = '<p class="error">Language is incorrect</p>';
                mvc.tempEnd(res, 'registration', output);
            } else {
                modelUsers.create(post.username, post.password, post.language, function (err, result) {
                    if (err) {
                        output.return = '<p class="error">Something failed.</p>'
                    } else {
                        output.return = '<p class="success">You have been registered.</p>';
                    }
                    mvc.tempEnd(res, 'registration', output);
                });
            }
        });
    } else {
        mvc.tempEnd(res, 'registration', output);
    }

};

userController.login = function (req, res) {
    var output = {
        return: '',
        form_username: '',
        form_password: ''
    };
    if (req.method == 'POST') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var post = qs.parse(body);
            output.form_password = post.password;
            output.form_username = post.username;
            if (!("username" in post) || ("username" in post && post.username.length == 0)) {
                output.return = '<p class="error">Username is empty</p>';
                mvc.tempEnd(res, 'login', output);
            } else if (!("password" in post) || ("password" in post && post.password.length == 0)) {
                output.return = '<p class="error">Password is empty</p>';
                mvc.tempEnd(res, 'login', output);
            } else {
                modelUsers.login(post.username, post.password, function (err, user) {
                    if (err) {
                        output.return = '<p class="error">Login failed.</p>';
                        mvc.tempEnd(res, 'login', output);
                    } else {
                        modelSessions.create(user, function (err, session) {
                            output.return = '<p class="success">Welcome ' + user.username + '.</p>';
                            var head = {
                                'Content-Type': 'text/html',
                                'Set-Cookie': require('../config').cookieName + '=' + session[0]._id + '; path=/',
                                'Refresh': '2;url=/room/choose'
                            };
                            mvc.tempEnd(res, 'login', output, 200, head);
                        });
                    }

                });
            }
        });
    } else {
        mvc.tempEnd(res, 'login', output);
    }

};

userController.stats = function (req, res) {
    var output = {
        timePlayed: 0,
        nbrRoomDone: 0,
        avgRoomDuration: 0,
        nbrRoomWon: 0,
        nbrRoundBeforeWin: 0,
        nbrRoundBeforeLoose: 0
    };
    //todo: Change this dirty pattern !
    modelRooms.getTimePlayed(req.userSession.user._id, function (errTimePlayed, resultTimePlayed) {
        if (resultTimePlayed.length == 1)
            output.timePlayed = resultTimePlayed[0].duration;
        modelRooms.getNbrDone(req.userSession.user._id, function (errNbrDone, resultNbrDone) {
            if (resultNbrDone.length == 1)
                output.nbrRoomDone = resultNbrDone[0].nbrGame;
            modelRooms.getAvgDuration(req.userSession.user._id, function (errAvgDuration, resultAvgDuration) {
                if (resultAvgDuration.length == 1)
                    output.avgRoomDuration = resultAvgDuration[0].duration;
                modelRooms.getNbrWon(req.userSession.user._id, function (errNbrWon, resultNbrWon) {
                    if (resultNbrWon.length == 1)
                        output.nbrRoomWon = resultNbrWon[0].nbrWon;
                    modelRooms.getNbrRoundsBeforeWin(req.userSession.user._id, function (errNbrRoundsBeforeWin, resultNbrRoundsBeforeWin) {
                        if (resultNbrRoundsBeforeWin.length == 1)
                            output.nbrRoundBeforeWin = resultNbrRoundsBeforeWin[0].avgRounds;
                        modelRooms.getNbrRoundsBeforeLoose(req.userSession.user._id, function (errNbrRoundsBeforeLoose, resultNbrRoundsBeforeLoose) {
                            if (resultNbrRoundsBeforeLoose.length == 1)
                                output.nbrRoundBeforeLoose = resultNbrRoundsBeforeLoose[0].avgRounds;
                            output.timePlayed = tools.millisecondsToStr(output.timePlayed);
                            output.avgRoomDuration = tools.millisecondsToStr(output.avgRoomDuration);
                            mvc.tempEnd(res, 'userStats', output);
                        });
                    });
                });
            });
        });
    });
};

module.exports = userController;