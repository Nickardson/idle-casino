define([], function () {
	$.extend(jQuery.easing, {toast: function(x,t,b,c,d) {
		return Math.sqrt(x);
	}});

	return {
		create: function (parent, text) {
			parent = $(parent);
			var t = $('<span></span>');
			t.html(text);

			var topKek = parent.offset().top;
			t.css({
				'position': 'absolute',
				'top': topKek,
				'left': parent.offset().left + (Math.random() * 10 - 5),
				'font-weight': 'bold',
				'opacity': 1,
				'pointer-events': 'none'
			});
			t.appendTo('body');

			t.animate({
				'top': topKek - 40,
				'opacity': 0.5
			}, {
				complete:function () {
					t.remove();
				},
				easing: 'toast',
				duration: 2000
			});
			return t;
		}
	};
});