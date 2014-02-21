directives.directive('myClear', function() {
	return {
		restrict: 'E',
		link: function(scope, element, attributes) {
			element.html('<div class="clear"></div>');
		}
	};
});