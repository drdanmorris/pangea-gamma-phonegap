'use strict';

var userControls = angular.module('myApp.userControls', []);

var numericUpDownControl = function(options) {
	options = angular.extend({
		title:'title', 
		increment:1, 
		value:0,
		onUp:function(){},
		onDown:function(){},
		downEnabled: false,
		upEnabled:true
	}, options);

	angular.extend(this, options);

}
numericUpDownControl.prototype.up = function() {
	this.value += this.increment;
    this.downEnabled = true;
    this.onUp(this.value);
};
numericUpDownControl.prototype.down = function() {
	if(this.value > 0) {
        this.value -= this.increment;
        if(this.value == 0) this.downEnabled = false;
        this.onDown(this.value);
    }
};


