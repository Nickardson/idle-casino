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

var cash;
require(['big', 'toast', 'slots'], function (Big, Toast, slots) {
	cash = new Big(0);

    function tick(ticks) {
        document.title = cash.toPrecision(5);
        var s = cash.toPrecision(18);
        if (s.indexOf('e') === -1 && s.indexOf('.') !== -1)
            s = s.substr(0, s.indexOf('.'));
        $('#cash').html(s);
    }

    var currentRoller = 0;
    var rollers = slots.createRollers('#slot', 3);

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
                var pay = slots.payout(rollers);
                cash = cash.plus(pay);
                
                var toast = Toast.create(this, "+$" + pay);
                toast.css('color', 'green');
            }
        } else {
            roller.start();
        }
    });


    // == Load / save ==
    function load () {
        if (localStorage.icSlots) {
            slots.slots = JSON.parse(localStorage.icSlots);
        }
        if (localStorage.icCash) {
            cash = new Big(localStorage.icCash);
        }
    }
    load();

    function save () {
        localStorage.icSlots = JSON.stringify(slots.slots);
        localStorage.icCash = cash.toString();
    }

    setInterval(save, 1000 * 60);

    $(window).unload(function() {
        save();
    });


    // == Ticks ==
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
});
