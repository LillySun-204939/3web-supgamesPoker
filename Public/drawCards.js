var symbolPath = { //Map to build symbols and numbers
    2: 'M10,200L11,187C15,149,23,136,70,97C93,78,100,68,101,57C104,31,81,23,65,23C46,22,23,34,35,62L12,68C8,43,12,18,33,8C61,-6,96,-1,115,21C127,36,129,56,123,72C104,113,39,131,35,179H105V152H127V200L10,200z',
    3: 'M2,156L18,145C31,167,47,181,70,178C104,176,119,140,112,113C105,89,76,77,53,90C47,93,43,96,41,96C39,96,33,85,34,82C50,59,87,21,87,21H28V47H6V0H120V16C120,16,90,48,80,64C104,65,125,81,132,105C136,118,135,148,129,160C119,182,94,199,71,200C33,202,12,176,2,156L2,156z',
    4: 'M70,200L70,183L86,183L86,153L5,153L5,133L93,0L107,0L107,133L132,133L132,153L107,153L107,183L120,183L120,200zM86,49L30,133L86,133z',
    5: 'M4,148L24,148C28,160,37,173,48,176C80,183,101,166,108,144C116,120,107,84,85,71C67,61,40,70,27,92L13,83L20,0H112V20H37L37,55C52,44,77,44,93,52C123,66,137,98,131,137C123,175,105,197,64,200C20,201,4,170,4,148L4,148z',
    6: 'M8,139C6,122,6,78,8,65C15,26,30,7,55,2C81,-4,116,3,124,35L103,36C91,14,60,15,46,29C34,37,28,68,30,70C30,70,50,55,73,55C120,55,132,94,130,127C129,167,116,198,73,200C31,198,12,177,8,139zM110,128C111,101,98,80,73,77C50,76,26,99,27,127C29,155,40,179,69,179C101,179,110,147,110,128z',
    7: 'M37,200C50,131,65,79,102,22H26V46H6V0H117L131,22C91,64,54,202,61,200H37z',
    8: 'M2,142C3,115,13,105,32,90C17,79,10,63,12,50C15,17,41,0,69,0C98,1,123,24,125,48C127,69,120,79,105,90C123,105,135,115,135,141C134,168,111,199,71,200C31,201,1,168,2,142L2,142zM113,142C115,117,93,101,69,101C45,101,23,121,23,143C23,166,51,178,69,178C91,178,112,163,113,142L113,142zM105,55C106,34,87,20,67,21C50,21,31,34,31,51C31,72,52,83,70,83C86,84,105,71,105,55L105,55z',
    9: 'MM11,161L30,156C37,174,52,180,67,178C94,176,102,146,104,120C94,131,78,137,64,136C21,134,10,100,10,65C9,35,21,13,43,3C55,-1,81,-1,92,4C118,18,128,42,126,98C126,144,117,198,66,200C36,204,14,181,11,161L11,161zM85,111C94,105,98,100,102,92C106,86,106,83,106,69C103,36,86,17,60,21C44,23,36,31,33,46C24,73,35,105,55,112C63,116,78,115,85,111L85,111z',
    10: 'M6,200V0H26V200H6M85,0C66,0,50,17,50,39V162C50,183,66,200,85,200H96C115,200,130,183,130,162V39C130,17,115,0,96,0H85M90,19C102,19,110,28,110,38V163C110,174,102,183,90,183C79,183,70,174,70,163V38C70,28,79,19,90,19L90,19z',
    11: 'M68,0V21H88C88,21,89,41,89,84C89,126,90,146,88,158C81,185,40,185,32,166C27,155,28,146,28,134H6C6,134,6,140,6,147C6,178,17,193,41,198C65,204,95,194,105,174C111,162,111,161,111,89C111,41,111,21,111,21H130V0H68z',
    12: 'M24,134L6,134L6,112L24,112C24,112,24,60,24,40C24,18,40,0,66,0C92,0,110,18,110,40C110,62,111,148,110,155C110,168,108,170,108,171C110,176,130,178,130,177L130,199C115,201,109,199,96,190C88,198,65,205,46,196C32,190,24,174,24,134zM81,174C73,162,58,145,44,140C44,156,46,165,51,171C59,181,71,183,81,174zM66,22C50,22,44,30,44,70C44,94,44,116,44,116C67,123,90,150,90,150L90,70C90,30,82,22,66,22z',
    13: 'M76,180L96,180L64,106L40,142L40,180L56,180L56,200L0,200L0,180L20,180L20,20L0,20L0,0L56,0L56,20L40,20L40,100L92.0636,19.841L76,20L76,0L136,0L136,20L120,20L76,88L116,180L136,180L136,200L76,200z',
    14: 'M6,200V183H23L58,0H78L117,183H131V200H85V183H97L92,156H46L42,183H54V200H6zM88,135L68,37L49,135H88z',
    h: 'M100,30C60,7,0,7,0,76C0,131,100,190,100,190C100,190,200,131,200,76C200,7,140,7,100,30z',
    d: 'M184,100C152,120,120,160,100,200C80,160,48,120,16,100C48,80,80,40,100,0C120,40,152,80,184,100z',
    s: 'M200,120C200,168,144,176,116,156C116,180,116,188,128,200C112,196,88,196,72,200C84,188,84,180,84,156C56,176,0,168,0,120C0,72,60,36,100,0C140,36,200,72,200,120z',
    c: 'M80,200C92,184,92,160,92,136C76,180,0,176,0,124C0,80,40,76,68,88C80,92,80,88,72,84C44,64,40,0,100,0C160,0,156,64,128,84C120,88,120,92,132,88C160,76,200,80,200,124C200,176,124,180,108,136C108,160,108,184,120,200C100,196,100,196,80,200z',
};

function playingCardEmpty(canvas, x, y, size) {
    function ax(n) {
        return x + n * size / 200;
    }

    function ay(n) {
        return y + n * size / 200;
    }

    function as(n) {
        return n * size / 200;
    }

    var fillLinGrad = canvas.createLinearGradient(ax(5), ay(5), ax(55), ay(200));
    fillLinGrad.addColorStop(0, '#fff');
    fillLinGrad.addColorStop(1, '#e0e0e0');

    canvas.fillStyle = fillLinGrad;
    fillPlayingCardRect(canvas, ax(0), ay(0), as(150), as(200), as(16));
    canvas.strokeStyle = '#666';
    strokePlayingCardRect(canvas, ax(0), ay(0), as(150), as(200), as(16));
}

function playingCardRect(canvas, x, y, width, height) {
    canvas.beginPath();
    canvas.moveTo(x, y);
    canvas.lineTo(x + width, y);
    canvas.lineTo(x + width, y + height);
    canvas.lineTo(x, y + height);
    canvas.lineTo(x, y);
    canvas.closePath();
}

function strokePlayingCardRect(canvas, x, y, width, height) {
    playingCardRect(canvas, x + 0.5, y + 0.5, width - 1, height - 1);
    canvas.stroke();
}

function fillPlayingCardRect(canvas, x, y, width, height) {
    playingCardRect(canvas, x, y, width, height);
    canvas.fill();
}

function playingCard(canvas, x, y, size, suit, point) {
    function ax(n) {
        return x + n * size / 200;
    }

    function ay(n) {
        return y + n * size / 200;
    }

    function as(n) {
        return n * size / 200;
    }

    playingCardEmpty(canvas, ax(0), ay(0), as(200));
    canvas.fillStyle = (suit === 'h' || suit === 'd') ? '#a22' : '#000';
    fillPlayingSymbol(canvas, ax(40), ay(65), as(70), suit);
    fillPlayingSymbol(canvas, ax(10), ay(10), as(40), point);
    fillPlayingSymbol(canvas, ax(11), ay(55), as(25), suit);
    fillPlayingSymbol(canvas, ax(140), ay(190), as(-40), point);
    fillPlayingSymbol(canvas, ax(139), ay(145), as(-25), suit);
}

function svgCurve(canvas, x, y, size, svgPath) {
    var relativeX;
    var relativeY;
    var pathNumber;
    var pathArray;

    function ax(n) {
        return ( relativeX = x + n * size / 200);
    }

    function ay(n) {
        return ( relativeY = y + n * size / 200);
    }

    var svgPathArray = svgPath.replace(/ *([MZLHVCSQTA]) */gi, '|$1,').replace(/^\||\|[Z],/gi, '').split(/\|/);

    canvas.beginPath();
    for (pathNumber in svgPathArray) {
        if (svgPathArray.hasOwnProperty(pathNumber)) {
            pathArray = svgPathArray[pathNumber].split(/[, ]/);
            if (pathArray[0] === 'M') {
                canvas.moveTo(ax(pathArray[1]), ay(pathArray[2]));
            } else if (pathArray[0] === 'L') {
                canvas.lineTo(ax(pathArray[1]), ay(pathArray[2]));
            } else if (pathArray[0] === 'H') {
                canvas.lineTo(ax(pathArray[1]), relativeY);
            } else if (pathArray[0] === 'V') {
                canvas.lineTo(relativeX, ay(pathArray[1]));
            } else if (pathArray[0] === 'C') {
                canvas.bezierCurveTo(ax(pathArray[1]), ay(pathArray[2]), ax(pathArray[3]), ay(pathArray[4]), ax(pathArray[5]), ay(pathArray[6]));
            } else if (pathArray[0] === 'Q') {
                canvas.quadraticCurveTo(ax(pathArray[1]), ay(pathArray[2]), ax(pathArray[3]), ay(pathArray[4]));
            }
        }
    }
    canvas.closePath();
}

function playingSymbol(canvas, x, y, size, symbol) {
    if (symbolPath[symbol]) {
        svgCurve(canvas, x, y, size, symbolPath[symbol]);
    }
}

function fillPlayingSymbol(canvas, x, y, size, symbol) {
    playingSymbol(canvas, x, y, size, symbol);
    canvas.fill();
}

function drawCardFromCode(canvas, x, y, size, code) {
    playingCard(canvas, x, y, size, code.slice(-1), code.substring(0, code.length - 1));
}