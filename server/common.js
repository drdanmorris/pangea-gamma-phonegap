
var common = {
	extend: function(childObj, parentObj) {
	    var tmpObj = function () {}
	    tmpObj.prototype = parentObj.prototype;
	    childObj.prototype = new tmpObj();
	    childObj.prototype.constructor = childObj;
	}

};

module.exports = common;