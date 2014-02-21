services.factory('SocketService', ['$q', 'Config', '$rootScope', 'EventService',  function ($q, config, $rootScope, eventSvc) {
	
	var socket = {
		isConnected: false
		, wasConnected: false
		, connecting: false
		, _connection: null
		, connectCount: 0  // number of times connection established
		, reconnectCount: 0  // number of concurrent reconnection attempts
		, sendQueue: []
		, incomingMsgCallback: null
		, doReconnect: true
		, start: function (incomingMsgCallback) {
			this.incomingMsgCallback = incomingMsgCallback;
			this.init();
			this.reconnect();
		}
		, init: function() {

			var my = this;

			eventSvc.onPause(function() {
				console.log('socket pausing');
				my.pause();
			});

			eventSvc.onResume(function() {
				console.log('socket resuming');
				my.resume();
			});
		}
		, pause: function() {
			this.doReconnect = false;
			this.disconnect();
		}
		, resume: function() {
			this.doReconnect = true;
			this.reconnect();
		}
		, send: function (msg) {
			if(typeof msg === 'object') msg = JSON.stringify(msg);
			if (this.isConnected) {
				//console.log('outgoing message: ' + msg);
				this._connection.send(msg);
			}
			else this.sendQueue.push(msg);
		}
		, reconnect: function (delayMs) {
			if(!this.doReconnect) return;
			console.log('reconnecting');
			delayMs = delayMs || 0;
			var my = this;
			this.reconnectCount += 1;
			setTimeout(function () {
				my.connect().then(function(conn) {
					while(my.sendQueue.length) {
						my.send(my.sendQueue.pop());
					}
				});
			}, delayMs)
		}
		, disconnect: function () {
			this._connection.close(1000, 'Application entering background');
		}
		, connect: function () {
			this.connecting = true;

			var my = this,
				defer = $q.defer(),
				connection = new WebSocket(config.websocket.url);

			connection.onmessage = function (e) {
				my.onSocketMessage(e.data);
			};
			connection.onopen = function () {
				my.onSocketOpen(defer, connection);
			};
			connection.onclose = function () {
				my.onSocketClose();
			};
			connection.onerror = function (e) {
				my.onSocketError(e);
			};

			connection.addEventListener("close", function(event) {
			  var code = event.code;
			  var reason = event.reason;
			  var wasClean = event.wasClean;
			  console.log('websocket closed: ' + code + ', ' + reason + ', ' + (wasClean ? 'clean' : 'not clean'));
			});

			return defer.promise;
		}
		, onSocketMessage: function (msg) {
			console.log('incoming message' + msg);  // verbose
			msg = JSON.parse(msg);
			this.processIncomingMessage(msg);
		}
		, onSocketOpen: function (defer, connection) {
			this.isConnected = this.wasConnected = true;
			this._connection = connection;
			this.reconnectCount = 0;
			console.log('socket opened');  // verbose
			// test websocket hybi payload length logic
			//connection.send('qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqabcdefghijklmnopqrstuvwxyzhhhhhh');
			defer.resolve(this._connection);
		}
		, onSocketClose: function (e) {
			this.isConnected = false;
			this._connection = null;
			console.log('socket closed'); 
			var my = this;
			setTimeout(function () {
				my.reconnect(config.websocket.reconnectDelayMs);
			}, 0);
		}
		, onSocketError: function () {
			console.log('socket error'); 
		}
		, processIncomingMessage: function (msg) {
			this.incomingMsgCallback(msg);
		}
	};
	return socket;
}]);