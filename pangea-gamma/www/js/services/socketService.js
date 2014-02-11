services.factory('SocketService', ['$q', 'Config', '$rootScope',  function ($q, config, $rootScope) {
	var socket = {
		isConnected: false
		, wasConnected: false
		, connecting: false
		, _connection: null
		, connectCount: 0  // number of times connection established
		, reconnectCount: 0  // number of concurrent reconnection attempts
		, sendQueue: []
		, incomingMsgCallback: null
		, start: function (incomingMsgCallback) {
			this.incomingMsgCallback = incomingMsgCallback;
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
		, onSocketClose: function () {
			this.isConnected = false;
			console.log('socket closed');  // verbose
			var my = this;
			setTimeout(function () {
				my.reconnect(config.websocket.reconnectDelayMs);
			}, 0);
		}
		, onSocketError: function () {
			this.isConnected = false;
			this._connection = null;
			console.log('socket error');  // verbose
			//if (!this.wasConnected) this.reconnect();
		}
		, processIncomingMessage: function (msg) {
			this.incomingMsgCallback(msg);
		}
	};
	return socket;
}]);