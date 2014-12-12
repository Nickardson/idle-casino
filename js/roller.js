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
	    $(rolls[0]).clone().appendTo(root);
	    rolls = $(root).children();
	    
		var stopFunc;

	    function move () {
	        var stop = false;
	        var kill = function () {
	            stop = true;
	            return this;
	        };

	        rolls.each(function (_, roll) {
	            roll = $(roll);

	            var filter = 'blur(1px)';
	            roll.css({'filter': filter,'-webkit-filter': filter,'-moz-filter': filter,'-o-filter': filter,'-ms-filter': filter});
	            
	            function doALoop() {
	                var rollsToDo = rollCount + 1;

	                roll.animate({
	                    'top': '-' + (100 * rollCount) + 'px'
	                }, {
	                    complete: function () {
	                        if (!stop) {
	                        	current = 0;
		                        roll.css('top', '0px');
	                            doALoop();
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

	    this.hardStop = function () {
	    	current = this.getCurrent();
	    	stopFunc();
	    	
	    	// stop animation
	    	rolls.stop(true, false);

	    	var filter = 'none';
			rolls.css({'filter': filter,'-webkit-filter': filter,'-moz-filter': filter,'-o-filter': filter,'-ms-filter': filter});

			// display rolled
            rolls.animate({'top': -100 * current + 'px'}, {
            	complete: function () {
            		started = false;
            	},
            	easing: 'linear',
            	queue: false,
            	duration: 250
            });
	    };

	    this.start = function () {
	    	started = true;
	    	stopFunc = move();

	    	return this;
	    };

	    function getCurrent () {
	    	var topKek = rolls[0].style.top;

	        topKek = Math.floor(-parseInt(topKek.substring(0, topKek.indexOf('px'))) / 100 + 0.5);
	        if (topKek > rollCount) {
	        	console.log(topKek, 'exceeds', rollCount+1);
	            return 0;
	        } else {
	        	return topKek % rollCount;
	        }
	    }

	    this.getCurrent = getCurrent;
    }

    return Roller;
});