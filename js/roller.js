define(function () {
    function Roller (root) {
    	root = $(root);
    	// number of things that pass by each second
    	var rollsPerSecond = 10;

    	// the current roll
    	var current = 0;

    	// whether the roller is started
    	var started = false;

    	this.setRollsPerSecond = function (rps) {
    		rollsPerSecond = rps;
    		return this;
    	};
    	
		this.isRolling = function () {
			return started;
		};

    	var rolls = $(root).children();
	    var rollCount = rolls.length;
	    // add first to end for a smooth loop
	    rolls.push($(rolls[0]).clone().appendTo(root));
	    
	    function move () {
	        var finalRoll;
	        var kill = function (at) {
	            finalRoll = Math.floor(at);
	            return this;
	        };

	        rolls.each(function (_, roll) {
	            roll = $(roll);

	            var filter = 'blur(1px)';
	            roll.css({'filter': filter,'-webkit-filter': filter,'-moz-filter': filter,'-o-filter': filter,'-ms-filter': filter});
	            
	            function doALoop(stopAt) {
	                var index = stopAt,
	                    rollsToDo = stopAt;

	                if (stopAt === undefined) {
	                    index = rollCount;
	                    rollsToDo = (index - current) + 1;
	                }

	                roll.animate({
	                    'top': '-' + (100 * index) + 'px'
	                }, {
	                    complete: function () {
	                        // stop once we have rolled with a custom value
	                        if (stopAt !== undefined) {
	                        	current = stopAt;
	                        	started = false;
	                        	this.stop = this.defaultStop;

	                        	var filter = 'none';
	            				roll.css({'filter': filter,'-webkit-filter': filter,'-moz-filter': filter,'-o-filter': filter,'-ms-filter': filter});

	                            return;
	                        }

	                        current = 0;
	                        roll.css('top', '0px');
	                        
	                        // if we have gotten a value for a final roll, roll with that, otherwise keep spinning
	                        if (finalRoll === undefined) {
	                            doALoop();
	                        } else {
	                            doALoop(finalRoll);
	                        }
	                    },
	                    easing: 'linear',
	                    queue: false,
	                    duration: 1000 / (rollsPerSecond / rollsToDo)
	                });
	            }
	            doALoop();
	        });

	        // return kill switch
	        return kill;
	    }

	    this.stop = this.defaultStop = function () {return this;};

	    this.start = function () {
	    	started = true;
	    	this.stop = move();

	    	return this;
	    };

	    function getCurrent () {
	    	if (!started) {
	    		return 0;
	    	}

	        var topKek = rolls[0].style.top;
	        topKek = -parseInt(topKek.substring(0, topKek.indexOf('px')));
	        if (topKek > (rollCount + 1) * 100) {
	            return 0;
	        } else {
	            return topKek / 100;
	        }
	    }

	    this.getCurrent = getCurrent;
    }

    return Roller;
});