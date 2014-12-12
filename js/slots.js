define(['roller'], function (Roller) {
	var slots = {};
	slots.slots = [
        // html,                                    3       1
        ['<img src="img/slot/goldenseven.png">',    777,    100],
        ['<img src="img/slot/cherry.png">',         250,    25],
        ['<img src="img/slot/watermelon.png">',     100,    10],
        ['<img src="img/slot/grape.png">',          100,    0],
        ['<img src="img/slot/plum.png">',           100,    0],
        ['<img src="img/slot/lemon.png">',            0,    0],
    ];

    function populateDataTable() {
    	var dataTable = $('.slottable').empty();
	    dataTable.append('<tr><th></th><th>x3</th><th>x1</th></tr>');
	    for (var i = 0; i < slots.slots.length; i++) {
	        var slot = slots.slots[i];
	        var row = $('<tr></tr>');
	        row.append('<td>' + slot[0] + '</td>');
	        row.append('<td>' + slot[1] + '</td>');
	        row.append('<td>' + slot[2] + '</td>');

	        dataTable.append(row);
	    }
    }
    populateDataTable();

    /**
     * Determines the payout for the given rollers
     * @param  {[Roller]} rollers The rollers to check.
     * @return {Number}         The base money earned
     */
    function payout(rollers) {
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

        for (var j = 0; j < slots.slots.length; j++) {
            // any 3 same
            if (counts[j] >= 3) {
                pay += slots.slots[j][1];
            } else if (counts[j] >= 1) {
                pay += slots.slots[j][2] * counts[j];
            }
        }
        console.log('Payout', pay);

        return pay;
    }

    function createRoller() {
		var r = $('<div class="roller"></div>');

		for (var i = 0; i < slots.slots.length; i++) {
		    var f = $('<div class="rollopt">' + i + '</div>');

		    f.html(slots.slots[i][0]);

		    r.append(f);
		}

		return r;
	}

	/**
	 * Creates 'n' rollers and appends them to the given parent.
	 * @param  {Element} parent Parent of the created roller elements.
	 * @param  {Number} n       Number of rollers
	 * @return {[Roller]}       Array of the created rollers
	 */
    function createRollers(parent, n) {
	    var rollers = [];
	    for (var i = 0; i < n; i++) {
	        rollers.push(new Roller(createRoller().appendTo(parent)).start());
	    }
	    return rollers;
    }

    slots.payout = payout;
	slots.createRoller = createRoller;
	slots.createRollers = createRollers;
	slots.populateDataTable = populateDataTable;

    return slots;
});