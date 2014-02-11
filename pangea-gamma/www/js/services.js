
var services = angular.module('myApp.services', []);
services.value('version', '0.1');


services.factory('Config', function () {
	return {
		websocket: {
			url: 'ws://192.168.2.2:8081/',
			reconnectDelayMs: 5000
		}
	};
});






