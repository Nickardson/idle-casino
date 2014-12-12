requirejs.config({
    baseUrl: 'js',
    paths: {
        data: "../data",
        text: 'require/text',
        json: 'require/json',
        async: 'require/async',
        big: 'big.min'
    }
});

require(['big', 'roller'], function (Big, Roller) {
	var cash = new Big(0);

    function tick(ticks) {
        // sample income
        cash = cash.plus(ticks);
        
        document.title = cash.toFixed(1);
    }

    var startTick = new Date();
    var accumulated = 0;
    var tickSize = 100;
    setInterval(function () {
        var now = new Date();
        var dt = now - startTick;
        startTick = now;

        accumulated += dt;

        var ticks = Math.floor(accumulated / tickSize);
        accumulated %= tickSize;

        tick(ticks * (tickSize / 1000));
    }, tickSize);

    var fruits = [
        ['1', 'red'],
        ['2', 'orange'],
        ['3', 'yellow'],
        ['4', 'green'],
        ['5', 'blue'],
    ];

    function createRoller() {
        var r = $('<div class="roller"></div>');

        for (var i = 0; i < fruits.length; i++) {
            var f = $('<div class="rollopt">' + i + '</div>');

            f.html(fruits[i][0]);
            f.css('background-color', fruits[i][1]);

            r.append(f);
        }

        return r;
    }

    // create rollers
    var currentRoller = 0;
    var rollers = [];
    for (var i = 0; i < 3; i++) {
        var roller = new Roller(createRoller().appendTo('#slot'));
        roller.start();
        rollers.push(roller);
    }

    var last = Date.now();
    $("#btnRoll").click(function () {
        var now = Date.now();

        // nospam
        if (now - last < 200) {
            return;
        }
        last = now;

        if (currentRoller >= rollers.length) {
            currentRoller = 0;
            for (var i = 0; i < rollers.length; i++) {
                rollers[i].start();
            }
            // force wait for 2 seconds before next roll
            last = now + 2000;
            return;
        }

        var roller = rollers[currentRoller];

        if (roller.isRolling()) {
            roller.hardStop();
            currentRoller++;
        } else {
            roller.start();
        }
    });
});
