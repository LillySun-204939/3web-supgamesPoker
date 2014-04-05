function getCookie(name) {
    if (document.cookie.length > 0) {
        start = document.cookie.indexOf(name + "=");
        pos = start + name.length + 1;
        if (start != 0) {
            start = document.cookie.indexOf("; " + name + "=");
            pos = start + name.length + 3;
        }
        if (start != -1) {
            start = pos;
            end = document.cookie.indexOf(";", start);
            if (end == -1) {
                end = document.cookie.length;
            }
            return unescape(document.cookie.substring(start, end));
        }
    }
    return '';
}

var socket = io.connect('http://' + window.location.host);
function subscribe(cookieName, roomId) {
    socket.emit('subscribe', { session: getCookie(cookieName), room: roomId });
}
//Chat
function initChat(cookieName, roomId) {
    socket.on('message', function (data) {
        if (document.getElementById('playing-chat')) {
            document.getElementById('playing-chat').innerHTML = '<li>' + data.username + ' : ' + data.message + '</li>'
                + document.getElementById('playing-chat').innerHTML;
        }
    });

    if (document.getElementById('sendToChatForm')) {
        document.getElementById('sendToChatForm').onsubmit = function () {
            socket.emit('sendMessage', { message: document.getElementById('sendToChat').value, session: getCookie(cookieName), room: roomId });
            document.getElementById('sendToChat').value = '';
            return false;
        };
    }
}

function rewritePokerSuit(id, array) {
    if (document.getElementById(id)) {
        var canvas = document.getElementById(id);
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        var margin = 0;
        array.forEach(function (card) {
            drawCardFromCode(context, margin, 0, 120, card);
            margin += 100;
        });
    }
}

function initPoker(cookieName, roomId) {
    if (document.getElementById('playing')) {
        socket.on('played', function (data) { //Refresh
            if ('currentDone' in data) {
                rewritePokerSuit('current-done', data.currentDone);
            }
            if ('currentBet' in data && document.getElementById('playing-bet')) {
                document.getElementById('playing-bet').innerHTML = '<h3>Current Bet</h3><ul>' + data.currentBet + '</ul>';
            }
            if ('currentScore' in data && document.getElementById('playing-score')) {
                document.getElementById('playing-score').innerHTML = data.currentScore;
            }

        });
        socket.on('myCards', function (data) { //Refresh
            rewritePokerSuit('my-cards', data);
        });
    }
    if (document.getElementById('playing-check')) {
        document.getElementById('playing-check').onclick = function () {
            socket.emit('play', { action: 'check', session: getCookie(cookieName), room: roomId });
        };
    }
    if (document.getElementById('playing-fold')) {
        document.getElementById('playing-fold').onclick = function () {
            socket.emit('play', { action: 'fold', session: getCookie(cookieName), room: roomId });
        };
    }
    if (document.getElementById('playing-actions')) {
        document.getElementById('playing-actions').onsubmit = function () {
            socket.emit('play', { action: 'bet', value: document.getElementById('betBy').value, session: getCookie(cookieName), room: roomId });
            document.getElementById('sendToChat').value = '';
            return false;
        };
    }
}