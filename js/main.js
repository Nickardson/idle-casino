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

require(['big'], function (Big) {
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
});
