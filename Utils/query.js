var url = require('url');
var isMongoID = require('./mvc').isValidMongoId;
var sessionsModel = require('../Model/sessions')
var queryUtils = {};

queryUtils.parseCookies = function (req) {
    if (!("cookie" in req.headers) || req.headers.cookie.length == 0) {
        return {};
    }
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = unescape(parts.join('='));
    });

    return list;
};

queryUtils.getPath = function (req) {
    return url.parse(req.url).pathname;
};

queryUtils.ifLogged = function (req, res, callback) {
    var cookies = queryUtils.parseCookies(req);
    var cookieName = require('../config').cookieName;
    if (cookieName in cookies && isMongoID(cookies[cookieName])) {
        sessionsModel.get(cookies[cookieName], function (err, session) {
            if (session) {
                //Todo : check expiration date
                req.userSession = session;
                callback(req, res);
            } else {
                res.writeHead(302, {"Location": "http://" + req.headers.host + "/user/login"});
                res.end();
            }

        });
    } else {
        res.writeHead(302, {"Location": "http://" + req.headers.host + "/user/login"});
        res.end();
    }
};

module.exports = queryUtils;