(function() {

	

	var eventService = services.service('EventService', [ function () {

		var my = this;

		document.addEventListener("pause", function() {
			my.fire(onPauseCallbacks);
		}, false);
	  	document.addEventListener("resume", function() {
	  		my.fire(onResumeCallbacks);
	  	}, false);

	  	var onPauseCallbacks = [],
	  		onResumeCallbacks = [];

	  	this.onPause = function(cb) {
	  		onPauseCallbacks.push(cb);
	  	};

	  	this.onResume = function(cb) {
	  		onResumeCallbacks.push(cb);
	  	};

	  	this.fire = function(cbs) {
	  		for(var i = 0; i < cbs.length; i++) {
	  			cbs[i]();
	  		}
		};



	}]);

})();