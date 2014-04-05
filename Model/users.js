var crypto = require('crypto');
var collectionName = "users";

var usersModel = {};
function randomSalt() {
    return crypto.randomBytes(32).toString('hex');
}

function hashPassword(password, salt) {
    var shasum = crypto.createHash('sha1');
    shasum.update(password + salt);
    return shasum.digest('hex');
}

usersModel.create = function (username, password, language, callback) {
    global.db.collection(collectionName, function (err, collection) {
        var salt = randomSalt();
        var data = {
            username: username,
            password: hashPassword(password, salt),
            language: language,
            salt: salt
        };
        collection.insert(data, function (err, result) {
            callback(err, result);
        });
    });
};

usersModel.login = function (username, password, callback) {
    global.db.collection(collectionName, function (err, collection) {
        collection.findOne({username: username}, function (err, user) {
            if (!user) {
                err = 'bad login';
            } else if (!err && user.password != hashPassword(password, user.salt)) {
                err = 'bad password';
            }
            callback(err, user);
        });
    });
};


module.exports = usersModel;