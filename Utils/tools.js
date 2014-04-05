exports.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

exports.shuffle = function (array) {
    var currentIndex = array.length;
    var temporaryValue;
    var randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
};

exports.clone = function (obj) {
    if (obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj)
        if (obj.hasOwnProperty(key))
            temp[key] = exports.clone(obj[key]);
    return temp;
};

exports.isEmpty = function (obj) {
    return Object.keys(obj).length === 0;
};

exports.countSimilars = function (array) {
    var quota = [];
    var prev;

    array.sort();
    for (var i = 0; i < array.length; i++) {
        if (array[i] !== prev) {
            quota.push(1);
        } else {
            quota[quota.length - 1]++;
        }
        prev = array[i];
    }

    return quota;
};

exports.getEntryById = function (array, id) {
    var data;
    array.forEach(function (entry) {
        if (entry._id.toHexString() == id) {
            data = entry;
        }
    });
    return data;
};

exports.millisecondsToStr = function (milliseconds) {
    function numberEnding(number) {
        return (number > 1) ? 's' : '';
    }

    var temp = milliseconds / 1000;
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less then a second';
}