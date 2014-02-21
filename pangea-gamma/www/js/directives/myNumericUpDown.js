directives.directive('myNumericUpDown', function() {
	return {
		restrict: 'E',
		scope: {
			ctrl: '='
		},
		replace: true,
		templateUrl: 'partials/myNumericUpDown.html'
	};
});