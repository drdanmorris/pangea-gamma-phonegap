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