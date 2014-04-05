var fs = require('fs');
var path = require('path');
var blocks = {};
var customPlaceHolders = {};
var config = require('../config');
customPlaceHolders.cookieName = config.cookieName;

fs.readdirSync(path.resolve(__dirname, '..', 'View', 'Blocks')).forEach(function (file) {
    blocks[file.replace('.html', '')] = fs.readFileSync(path.resolve(__dirname, '..', 'View', 'Blocks', file), 'utf8');
});

exports.getView = function (view, toReplace) {
    var html = fs.readFileSync(path.resolve(__dirname, '..', 'View', view + '.html'), 'utf8');
    [toReplace, customPlaceHolders, blocks].forEach(function (entry) {
        if (typeof entry != 'undefined') {
            Object.keys(entry).forEach(function (key) {
                var regex = new RegExp("##" + key + "##", "gi");
                html = html.replace(regex, entry[key]);
            });
        }
    });
    return html;
};

function getPublicPath(uri) {
    return __dirname + '/..' + '/Public' + uri;
}

exports.existsIntoPublic = function (uri) {
    return fs.existsSync(getPublicPath(uri));
};

exports.exposeFromPublic = function (req, res, uri) {
    var stream = fs.createReadStream(getPublicPath(uri));
    stream.on('error', function (error) {
        res.writeHead(500);
        res.end();
    });
    res.writeHead(200);
    stream.pipe(res);
};

exports.isValidMongoId = function (hexHash) {
    var hexRegex = new RegExp("^[0-9a-fA-F]{24}$");
    return hexRegex.test(hexHash);
};

exports.tempEnd = function (res, view, output, code, header) {
    code = typeof code !== 'undefined' ? code : 200;
    header = typeof header !== 'undefined' ? header : {"Content-Type": "text/html"};
    var html = exports.getView(view, output);
    res.writeHead(code, header);
    res.write(html);
    res.end();
};