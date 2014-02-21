directives.directive('mySwitch', function() {
	return {
		restrict: 'E',
		scope: {
			ctrl: '='
		},
		replace: true,
		templateUrl: 'partials/mySwitch.html',
		link: function(scope, element, attributes) {
			element.on('click', function() {
				scope.ctrl.position = (scope.ctrl.position === 'on' ? 'off' : 'on');
				scope.$apply();
			})
		}
	};
});