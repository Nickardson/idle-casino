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

require(['big', 'roller', 'toast'], function (Big, Roller, Toast) {
	var cash = new Big(0);

    function tick(ticks) {
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

    var slots = [
        // html,                                    3       1
        ['<img src="img/slot/goldenseven.png">',    777,    100],
        ['<img src="img/slot/cherry.png">',         250,    25],
        ['<img src="img/slot/watermelon.png">',     100,    10],
        ['<img src="img/slot/grape.png">',          100,    0],
        ['<img src="img/slot/plum.png">',           100,    0],
        ['<img src="img/slot/lemon.png">',            0,    0],
    ];

    var dataTable = $('<table class="slottable table"></table>');
    dataTable.append('<tr><th></th><th>x3</th><th>x1</th></tr>');
    for (var i = 0; i < slots.length; i++) {
        var slot = slots[i];
        var row = $('<tr></tr>');
        row.append('<td>' + slot[0] + '</td>');
        row.append('<td>' + slot[1] + '</td>');
        row.append('<td>' + slot[2] + '</td>');

        dataTable.append(row);
    }

    $('#slot').append(dataTable);

    function createRoller() {
        var r = $('<div class="roller"></div>');

        for (var i = 0; i < slots.length; i++) {
            var f = $('<div class="rollopt">' + i + '</div>');

            f.html(slots[i][0]);

            r.append(f);
        }

        return r;
    }

    // create rollers
    var currentRoller = 0;
    var rollers = [];
    for (var i = 0; i < 3; i++) {
        rollers.push(new Roller(createRoller().appendTo('#slot')).start());
    }

    function payout() {
        var s = rollers.map(function (roller, i) {
            return Math.floor(roller.getCurrent() + 0.5);
        });

        // count up number of each index
        var counts = {};
        for (var i = 0; i < s.length; i++) {
            if (counts[s[i]] === undefined) {
                counts[s[i]] = 1;
            } else {
                counts[s[i]]++;
            }
        }
        
        var pay = 0;

        for (var j = 0; j < slots.length; j++) {
            // any 3 same
            console.log(counts[j], slots[j]);
            if (counts[j] >= 3) {
                pay += slots[j][1];
            } else if (counts[j] >= 1) {
                pay += slots[j][2] * counts[j];
            }
        }
        console.log('Payout', pay);

        return pay;
    }

    var last = Date.now();
    $("#btnRoll").click(function () {
        var now = Date.now();

        // nospam
        if (now - last < 100) {
            return;
        }
        last = now;

        if (currentRoller >= rollers.length) {
            currentRoller = 0;
            for (var i = 0; i < rollers.length; i++) {
                rollers[i].start();
            }
            // force wait for 1 second before next roll
            last = now + 1000;
            return;
        }

        var roller = rollers[currentRoller];

        if (roller.isRolling()) {
            roller.hardStop();
            currentRoller++;

            // payout
            if (currentRoller == rollers.length) {
                var pay = payout();
                cash = cash.plus(pay);
                
                var toast = Toast.create(this, "+$" + pay);
                toast.css('color', 'green');
            }
        } else {
            roller.start();
        }
    });
});
