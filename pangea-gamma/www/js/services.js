'use strict';


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


services.factory('PushService', ['$q', 'Config', '$rootScope', 'SocketService', function ($q, config, $rootScope, socket) {
	var push = {
		initialised: false
		, requestId: 1
		, delegate: null
		, init: function () {
			if (!this.initialised) {
				socket.start(this.handleIncomingMsg.bind(this));
			}
		}
		, handleIncomingMsg: function (msg) {
			if (msg.isInitial) {
				if(msg.view && msg.view.vref) {
					this.handleInitialVref(msg.view, msg.responseId);
				}
				else if(msg.data && msg.data.dref) {
					this.handleInitialDref(msg.data, msg.responseId);
				}
			}
			else {
				if(this.delegate) this.delegate(msg.data);
			}
			// $rootScope.$apply(function () {  // do we need to apply ?
			//     $rootScope.$broadcast('pushIncomingMessage', msg);
			// });
		}
		, fulfilRequest: function(view, responseId) {
			this.pending['view' + responseId].defer.resolve(view);
			this.pending['view' + responseId] = null;
		}
		, findDrefContainer: function(obj, dref) {
			for(var prop in obj) {
				if(prop === 'dref' && obj[prop] === dref) return obj;  //found
				else if(typeof obj[prop] === 'object') {
					var container = this.findDrefContainer(obj[prop], dref);
					if(container) 
						return container;
				}
			}
			return null;
		}
		, handleInitialVref: function(view, responseId) {
			if(view.drefs){
				var pendingView = this.pending['view' + responseId];
				pendingView.view = view;
				pendingView.remainingDrefs = view.drefs;  // todo - copy
				
				// need to wait for data to arrive
				for(var i = 0; i < view.drefs.length; i++ ){
					var dref = view.drefs[i];
					var my = this;
					this.pending[dref + '_' + responseId] = function(pendingView, data, dref) {
						var container = my.findDrefContainer(pendingView.view, dref);
						if(container) {
							angular.extend(container, data);
							for(var j = 0; j < pendingView.remainingDrefs.length; j++) {
								if(pendingView.remainingDrefs[j] === dref) {
									pendingView.remainingDrefs.splice(j, 1);
									break;
								}
							}
						}
						else
							throw 'Unable to find data reference container for ' + dref;

						return pendingView.remainingDrefs.length === 0;  // all pending drefs processed
					};
				}
			}
			else {
				this.fulfilRequest(view, responseId);
			}
		}   
		, handleInitialDref: function(data, responseId) {
			var dref = data.dref;
			var pendingView = this.pending['view' + responseId];
			var fnAllDrefsProcessed = this.pending[dref + '_' + responseId];
			if(fnAllDrefsProcessed(pendingView, data, dref)) {
				this.fulfilRequest(this.pending['view' + responseId].view, responseId);
			} 
		}   
		, pending: {}
		, subscribe: function (options) {
			options = angular.extend({ vref: null, delegate: null }, options);
			var ref = options.vref,
				defer = $q.defer(),
				requestId = this.requestId++,
				request = angular.extend({ cmd: 'subscribe', requestId: requestId }, options);
			this.pending['view' + requestId] = { defer: defer };
			this.delegate = options.delegate;
			socket.send(request);
			return defer.promise;
		}
	};
	push.init();
	return push;
}]);


services.service('ViewService', ['$rootScope', '$location', function ($rootScope, $location) {
	var Vref = function (raw, tabIndex, title) {
		var parts = /(?:([\d]+)\/)?([\w\d]+)\/([\w\d]+)\/([\w\d]+)/.exec(raw);
		this.raw = raw;
		this.tab = null;
		this.type = null;
		this.subtype = null;
		this.id = null;
		this.title = title;
		if (parts.length == 5) {
			this.tab = parts[1] || tabIndex;
			this.type = parts[2];
			this.subtype = parts[3];
			this.id = parts[4];
			this.raw = this.tab + '/' + this.type + '/' + this.subtype + '/' + this.id;
		}
	};

	var Tab = function (options) {
		this.history = [];
		this.id = options.id;
		this.title = options.title;
		this.vref = new Vref(options.vref, this.id, this.title);
		this.icon = options.icon;
		this.notifyCount = options.notifyCount;
	};
	Tab.prototype.getVref = function() {
		if (this.history.length > 0) return this.history[this.history.length - 1];
		return this.vref;
	};

	var viewsvc = {
		title: 'Title',
		vref: null,
		tabIndex: 0,
		tabs: [
			new Tab({ id: 0, title: 'Watchlist', vref: 'menu/usr/0', icon: 'watchlist', notifyCount: 3 }),
			new Tab({ id: 1, title: 'Browse', vref: 'menu/sports/0', icon: 'browse', notifyCount: 0 }),
			new Tab({ id: 2, title: 'Account', vref: 'acct/home/0', icon: 'account', notifyCount: 0 }),
			new Tab({ id: 3, title: 'Position', vref: 'pos/home/0', icon: 'position', notifyCount: 99 }),
			new Tab({ id: 4, title: 'Help', vref: 'help/home/0', icon: 'help', notifyCount: 0 })
		],
		tab: null,
		backVref: null,
		back: '',
		appClass: '',
		bannerClass: 'summary',
		viewClass: '',
		platform: '',
		mainHeight: 0,

		setPlatform: function(platform) {
			this.platform = platform;
			this.setMainHeight();
		},

		getDimensions: function() {
			var dimensionsAll = 0;
			var dimensions = {
				toolBarHeight: 50,
				summaryBannerHeight: 40,
				tabBarHeight: 50,
				ios: {
					marginTop: 20
					// ,viewPaddingTop: 90,
				},
				android: {
					margins: 4
				},
				android4: {
					margins: 2,
					tabBarAdjHeight: -6
				}
			};
			for(var prop in dimensions) {
				if(dimensions.hasOwnProperty(prop)) {
					var val = dimensions[prop];
					if(typeof val === 'object') {
						if(prop === viewsvc.platform) {
							for(var platprop in val) {
								if(val.hasOwnProperty(platprop)) {
									var platval = val[platprop];
									dimensionsAll += platval;
								}
							}
						}
						else
							continue;
					}
					else {
						dimensionsAll += val;
					}
				}
			}
			return dimensionsAll;
		},


		setMainHeight: function() {
			this.mainHeight = window.innerHeight - this.getDimensions(); 
		},
		navigateTab: function(idx) {
			this.tabIndex = idx;
			this.tab = this.tabs[idx];
			this.appClass = 'tab';
			//$location.path(this.tab.vref.raw);
			this.doNavigate(this.tab.vref, 'tab');
		},
		navigate: function (vref) {
			this.appClass = 'forward';
			this.doNavigate(vref, 'forward');
		},
		goBack: function () {
			var vref = this.tab.history.pop();
			this.appClass = 'back';
			this.doNavigate(vref, 'back');
		},
		doNavigate: function (vref, dir) {
			this.viewClass = '';
			if (angular.isString(vref)) vref = new Vref(vref, this.tabIndex);
			this.vref = vref;
			if(dir === 'forward')  {
				this.tab.vref.title = this.title;
				this.tab.history.push(this.tab.vref);
				this.back = this.title; //'Back'
			}
			else {
				if(this.tab.history.length) {
					this.back = this.tab.history[this.tab.history.length-1].title;
				}
				else this.back = '';
			}
			this.tab.vref = vref;
			$location.path(vref.raw);
		}
	};
	viewsvc.tab = viewsvc.tabs[0]; 
	return viewsvc;
}]);
