var engine = {};
var values = Array.apply(null, new Array(13)).map(function (_, i) {
    return i + 2;
});
var colors = ['h', 'd', 's', 'c'];
var tools = require('./tools');
var config = require('../config');

engine.getCard = function (cardsInRoom) {
    var cardName = values[Math.floor(Math.random() * values.length)] + colors[Math.floor(Math.random() * colors.length)];
    if (cardsInRoom.indexOf(cardName) != -1) {
        return engine.getCard(cardsInRoom);
    }
    cardsInRoom.push(cardName);
    return cardName;
};

engine.initGame = function (room) {
    room.startedAt = new Date();
    engine.initMoney(room.players, 100);
    room.rounds = [];
    room.rounds.push(engine.newRound(room.players));
};

engine.roundBreak = function (room) {
    return engine.getWinnerForRoom(room) != false;
};

engine.getWinnerForRoom = function (room) {

    var winner = false;
    room.players.forEach(function (player) {
        if ('money' in player && player.money == 400)
            winner = player
    });
    return winner;
};

engine.endGame = function (room) {
    room.endedAt = new Date();
    room.duration = room.endedAt - room.startedAt;
};

engine.initMoney = function (players, money) {
    for (var playerId in players) {
        if (players.hasOwnProperty(playerId)) {
            var player = players[playerId];
            player.money = money;
        }
    }
};

engine.newRound = function (players) {
    var round = {
        cardsInGame: [],
        turns: [],
        cardsOnTable: [],
        roundPlayers: {},
        orderToPlay: []
    };
    round.cardsOnTable.push(engine.getCard(round.cardsInGame));
    engine.initPlayerCards(round.roundPlayers, players, round.cardsInGame);
    round.orderToPlay = engine.randomRoles(round.roundPlayers);
    engine.incrementRoundNumber(players, round.orderToPlay);
    engine.setDefaultBlind(round.roundPlayers, players, round.orderToPlay);
    round.turns.push(engine.newTurn());
    return round;
};

engine.incrementRoundNumber = function (players, orderToPlay) {
    players.forEach(function (player) {
        if (orderToPlay.indexOf(player._id.toHexString())) {
            if (!('rounds' in player)) {
                player.rounds = 1;
            } else {
                player.rounds += 1;
            }
        }
    });
};

engine.initPlayerCards = function (objToFill, players, cardsInGame) {
    players.forEach(function (player) {
        if (player.money > 0) {
            var playerId = player._id.toHexString();
            objToFill[playerId] = {
                cards: []
            };
            Array.apply(null, new Array(2)).map(function (_, i) {
                return i;
            }).forEach(function () {
                objToFill[playerId].cards.push(engine.getCard(cardsInGame));
            });
        }
    });
};

engine.newTurn = function () {
    return {
        playersStatus: {}
    };
};

engine.getLastTurn = function (room) {
    var lastRound = engine.getLastRound(room);
    return lastRound.turns[lastRound.turns.length - 1];
};

engine.getLastRound = function (room) {
    return room.rounds[room.rounds.length - 1]
};

engine.randomRoles = function (roomPlayers) {
    var orderToplay = [];
    for (var playerId in roomPlayers) {
        if (roomPlayers.hasOwnProperty(playerId))
            orderToplay.push(playerId);
    }
    orderToplay = tools.shuffle(orderToplay);
    return orderToplay;
};

engine.turnIsOver = function (room) {
    var orderToPlay = engine.getLastRound(room).orderToPlay;
    var playerStatus = tools.clone(engine.getLastTurn(room).playersStatus);
    for (var playerId in playerStatus) {
        if (playerStatus.hasOwnProperty(playerId)) {
            if (playerStatus[playerId] == 'fold') {
                delete playerStatus[playerId];
            }
        }
    }
    return orderToPlay.length == tools.size(playerStatus);
};

engine.turnBreak = function (room) {
    var lastRound = engine.getLastRound(room);
    if (lastRound.cardsOnTable.length < 3)
        engine.revealNewCard(room);
    else {
        var totalBet = engine.getAllBet(room);
        var whoWin = engine.getWinnerForRound(room);
        tools.getEntryById(room.players, whoWin).money += totalBet;
        if (engine.roundBreak(room)) {
            engine.endGame(room);
        } else {
            room.rounds.push(engine.newRound(room.players));
        }
    }
};

engine.getWinnerForRound = function (room) {
    var lastRound = engine.getLastRound(room);
    var winner;
    var bestScore = 0;
    lastRound.orderToPlay.forEach(function (id) {
        var cards = lastRound.roundPlayers[id].cards.concat(lastRound.cardsOnTable);
        var score = engine.calcScore(cards);
        if (score > bestScore) {
            winner = id;
            bestScore = score;
        }
    });
    return winner;
};

engine.calcScore = function (cards) {
    var score = engine.calcSimpleValue(cards);
    if (engine.isFlush(cards) && engine.isStraight(cards) && engine.mainCardIsAs(cards)) {
        score += Math.pow(10, 16);
    } else if (engine.isFlush(cards) && engine.isStraight(cards)) {
        score += Math.pow(10, 14);
    } else if (engine.isQuads(cards)) {
        score += Math.pow(10, 12);
    } else if (engine.isFlush(cards)) {
        score += Math.pow(10, 10);
    } else if (engine.isStraight(cards)) {
        score += Math.pow(10, 8);
    } else if (engine.isSet(cards)) {
        score += Math.pow(10, 6);
    } else if (engine.isTwoPair(cards)) {
        score += Math.pow(10, 4);
    } else if (engine.isPair(cards)) {
        score += Math.pow(10, 2);
    }
    return score;
};

engine.isFlush = function (cards) {
    var color = cards[0].slice(-1);
    var result = true;
    cards.forEach(function (card) {
        if (color != card.slice(-1))
            result = false;
    });
    return result;
};

engine.getCardsNumbers = function (cards) {
    var array = [];
    cards.forEach(function (card) {
        array.push(+card.substring(0, card.length - 1));
    });
    return array;
};

engine.mainCardIsAs = function (cards) {
    var cardsSorted = engine.getCardsNumbers(cards).sort();
    return cardsSorted[cardsSorted.length - 1] == 14;
};

engine.isQuads = function (cards) {
    var quotas = tools.countSimilars(engine.getCardsNumbers(cards).sort());
    return quotas.indexOf(4) > -1;

};

engine.isFull = function (cards) {
    var quotas = tools.countSimilars(engine.getCardsNumbers(cards).sort());
    return quotas.indexOf(3) > -1 && quotas.indexOf(2) > -1;

};

engine.isSet = function (cards) {
    var quotas = tools.countSimilars(engine.getCardsNumbers(cards).sort());
    return quotas.indexOf(3) > -1;
};

engine.isTwoPair = function (cards) {
    var quotas = tools.countSimilars(engine.getCardsNumbers(cards).sort());
    var again = tools.countSimilars(quotas);
    return again.indexOf(2) > -1;
};

engine.isPair = function (cards) {
    var quotas = tools.countSimilars(engine.getCardsNumbers(cards).sort());
    return quotas.indexOf(2) > -1;
};

engine.isStraight = function (cards) {
    var cardsNumbers = engine.getCardsNumbers(cards).sort();
    var currentCard;
    var isStraight = true;
    cardsNumbers.forEach(function (card) {
        if (isStraight == true) {
            if (typeof currentCard == 'undefined') {
                currentCard = card;
            } else {
                if (card != currentCard + 1)
                    isStraight = false;
                currentCard = card;
            }
        }
    });
    return isStraight;
};

engine.calcSimpleValue = function (cards) {
    var cardNumbers = engine.getCardsNumbers(cards);
    return cardNumbers.reduce(function (pv, cv) {
        return pv + cv;
    }, 0);
};

engine.getMaxBet = function (room) {
    var roundPlayers = engine.getLastRound(room).roundPlayers;
    var maxBet = 0;
    for (var playerId in roundPlayers) {
        if (
            roundPlayers.hasOwnProperty(playerId)
            && 'bet' in roundPlayers[playerId]
            && roundPlayers[playerId].bet > maxBet
            ) {
            maxBet = roundPlayers[playerId].bet;
        }
    }
    return +maxBet;
};

engine.allPlayersBetMax = function (room) {
    var maxBet = engine.getMaxBet(room);
    var lastRound = engine.getLastRound(room);
    var roundPlayers = lastRound.roundPlayers;
    var countToMax = 0;
    lastRound.orderToPlay.forEach(function (playerId) {
        if (
            roundPlayers.hasOwnProperty(playerId)
            && 'bet' in roundPlayers[playerId]
            && (roundPlayers[playerId].bet == maxBet || tools.getEntryById(room.players, playerId).money <= 0)
            ) {
            countToMax++;
        }
    });
    return countToMax == lastRound.orderToPlay.length;
};

engine.getAllBet = function (room) {
    var roundPlayers = engine.getLastRound(room).roundPlayers;
    var allBet = 0;
    for (var playerId in roundPlayers) {
        if (
            roundPlayers.hasOwnProperty(playerId)
            && 'bet' in roundPlayers[playerId]
            && roundPlayers[playerId].bet > 0
            ) {
            allBet += roundPlayers[playerId].bet;
        }
    }
    return allBet;
};

engine.itsMyTurn = function (room, idPlayer) {
    var lastRound = engine.getLastRound(room);
    var nextToPlay = engine.nextToPlay(room);
    if (nextToPlay == lastRound.orderToPlay[0] && tools.size(engine.getLastTurn(room).playersStatus) > 0)
        lastRound.turns.push(engine.newTurn());
    return  nextToPlay == idPlayer;
};

engine.nextToPlay = function (room) {
    var orderToPlay = engine.getLastRound(room).orderToPlay;
    var playerStatus = tools.clone(engine.getLastTurn(room).playersStatus);
    var nextToPlay;
    var stop;

    for (var id in playerStatus)
        if (playerStatus.hasOwnProperty(id) && playerStatus[id] == 'fold')
            delete playerStatus[id];

    if (orderToPlay.length == tools.size(playerStatus)) {
        return orderToPlay[0];
    }
    orderToPlay.forEach(function (id) {

        if (stop != true && !(id in playerStatus)) {
            nextToPlay = id;
            stop = true;
        }
    });
    return nextToPlay;
};

engine.setDefaultBlind = function (toApply, players, orderToPlay) {
    var bigBlindValue = config.bigBlind;
    var bigBlind = tools.getEntryById(players, orderToPlay[0]);
    if (bigBlind.money < bigBlindValue)
        bigBlindValue = bigBlind.money;
    toApply[orderToPlay[0]].bet = bigBlindValue;
    bigBlind.money -= bigBlindValue;

    var smallBlindValue = config.smallBlind;
    var smallBlind = tools.getEntryById(players, orderToPlay[1]);
    if (smallBlind.money < smallBlindValue)
        smallBlindValue = smallBlind.money;
    toApply[orderToPlay[1]].bet = smallBlindValue;
    smallBlind.money -= smallBlindValue;
};

engine.revealNewCard = function (room) {
    var lastRound = engine.getLastRound(room);
    lastRound.cardsOnTable.push(engine.getCard(lastRound.cardsInGame));
};

engine.play = {
    fold: function (room, idPlayer) {
        engine.getLastTurn(room).playersStatus[idPlayer] = 'fold';
        var lastRound = engine.getLastRound(room);
        var index = lastRound.orderToPlay.indexOf(idPlayer.toHexString());
        if (index > -1) {
            lastRound.orderToPlay.splice(index, 1);
        }
    },
    bet: function (room, idPlayer, value) {
        value = parseInt(value);
        var lastRound = engine.getLastRound(room);
        var bet = 0;
        if ('bet' in lastRound.roundPlayers[idPlayer]) {
            bet = +lastRound.roundPlayers[idPlayer].bet;
        }
        var maxBet = engine.getMaxBet(room);
        if (maxBet >= (value + bet)) {
            engine.play.check(room, idPlayer);
            return;
        }
        if (value > tools.getEntryById(room.players, idPlayer).money)
            value = tools.getEntryById(room.players, idPlayer).money;

        lastRound.roundPlayers[idPlayer].bet = (bet + value);
        tools.getEntryById(room.players, idPlayer).money -= value;
        engine.getLastTurn(room).playersStatus[idPlayer] = 'bet';

    },
    check: function (room, idPlayer) {
        var lastRound = engine.getLastRound(room);
        var orderToPlay = lastRound.orderToPlay;
        var bet = 0;
        if ('bet' in lastRound.roundPlayers[idPlayer]) {
            bet = lastRound.roundPlayers[idPlayer].bet;
        }
        var maxBet = engine.getMaxBet(room);
        if (bet < maxBet) {
            var toAdd = maxBet - bet;
            if (toAdd > tools.getEntryById(room.players, idPlayer).money)
                toAdd = tools.getEntryById(room.players, idPlayer).money;
            lastRound.roundPlayers[idPlayer].bet = bet + toAdd;
            tools.getEntryById(room.players, idPlayer).money -= toAdd;
        }

        if (orderToPlay[0] == idPlayer && engine.allPlayersBetMax(room)) {
            engine.turnBreak(room);
        }

        engine.getLastTurn(room).playersStatus[idPlayer] = 'check';
    }
};

engine.getCurrentBetString = function (room) {
    var lastRound = engine.getLastRound(room);
    var nextToPlay = engine.nextToPlay(room);
    var string = '<ul>';

    var allPlayers = lastRound.orderToPlay.slice();
    Object.keys(lastRound.roundPlayers).forEach(function (value) {
        if (allPlayers.indexOf(value) == -1) allPlayers.push(value);
    });
    allPlayers.forEach(function (id) {
        string += '<li>';
        if (id == nextToPlay)
            string += '<strong>';
        else if (lastRound.orderToPlay.indexOf(id) == -1)
            string += '<span class="fold">';
        string += tools.getEntryById(room.players, id).username;
        string += ' : ';

        if (id in lastRound.roundPlayers && 'bet' in lastRound.roundPlayers[id]) {
            string += lastRound.roundPlayers[id].bet;
        } else {
            string += 0
        }
        string += '$';
        if (id == nextToPlay)
            string += '</strong>';
        else if (lastRound.orderToPlay.indexOf(id) == -1)
            string += '</span>';
        string += '</li>';
    });
    return string + '</ul>';
};

engine.getCurrentScore = function (room) {
    var score = '';
    room.players.forEach(function (player) {
        var money = 0;
        if ('money' in player)
            money = player.money;
        score += '<li>' + player.username + ' : ' + money + '$</li>';
    });
    return score;
};

engine.getMyCards = function (room, idPlayer) {
    var roundPlayers = engine.getLastRound(room).roundPlayers;
    if (typeof idPlayer != 'string')
        idPlayer = idPlayer.toHexString();
    if (idPlayer in roundPlayers)
        return roundPlayers[idPlayer].cards;
    else
        return [];
};

module.exports = engine;