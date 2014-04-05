var mvc = require('../Utils/mvc.js');

module.exports = function (req, res) {
    var output = {
        path: require('url').parse(req.url).pathname
    };
    mvc.tempEnd(res, '404', output, 404);
};