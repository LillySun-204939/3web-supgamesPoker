var mvc = require('./mvc.js');
var queryUtils = require('./query.js');
module.exports = function (req, res) {
    var path = queryUtils.getPath(req);
    console.log('[Access] ' + path);
    if (path == '/') {
        require('../Controller/home')(req, res);
    } else if (mvc.existsIntoPublic(path)) {
        mvc.exposeFromPublic(req, res, path);
    } else if (path == '/user/registration') {
        require('../Controller/user').registration(req, res);
    } else if (path == '/user/login') {
        require('../Controller/user').login(req, res);
    } else if (path == '/room/choose') {
        require('../Controller/room').list(req, res);
    } else if (path == '/room/new') {
        queryUtils.ifLogged(req, res, require('../Controller/room').create);
    } else if (path == '/room/enter') {
        queryUtils.ifLogged(req, res, require('../Controller/room').enter);
    } else if (path == '/user/stats') {
        queryUtils.ifLogged(req, res, require('../Controller/user').stats);
    } else if (path == '/ladder') {
        require('../Controller/ladder')(req, res);
    } else {
        require('../Controller/404')(req, res);
    }
};
