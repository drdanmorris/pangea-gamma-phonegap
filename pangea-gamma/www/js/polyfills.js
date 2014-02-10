Function.prototype.bind = Function.prototype.bind || function(fn) {
	var func = this;
	return function() {
		return func.apply(fn, arguments);
	}
}

