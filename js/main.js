requirejs.config({
    baseUrl: 'js',
    paths: {
        data: "../data",
        text: 'require/text',
        json: 'require/json',
        async: 'require/async'
    }
});

require([], function () {
	
});