services.service('ViewService', ['$rootScope', '$location', function ($rootScope, $location) {
	
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
			new Tab({ id: 3, title: 'Device', vref: 'device/info/0', icon: 'position', notifyCount: 99 }),
			new Tab({ id: 4, title: 'Help', vref: 'help/home/0', icon: 'help', notifyCount: 0 })
		],
		tab: null,
		backVref: null,
		appClass: '',
		orientation: 'portrait',
		bannerClass: 'summary',
		viewClass: '',
		platform: '',
		platformVersion: 'v' + device.version,
		platformSupport: '',
		mainHeight: 0,
		currentViewController: null,
		alternateVref: null,

		init: function() {
			this.setMainHeight();
			this.resetView();
			this.setPlatformSupport();
		},

		setPlatformSupport: function() {
			var support = {
				css3: true
			};
			if(this.platform === 'android') {
				var version = new Version(device.version);
				if(version.isLessThan('3')) {
					support.css3 = false;
				}
			}

			var ps = '';
			for(prop in support) {
				if(support[prop])
					ps += prop + ' ';
			}
			this.platformSupport = ps;
		},

		setPlatform: function(platform) {
			console.log('setPlatform:' + platform);
			this.platform = platform;
		},

		getDimensions: function() {
			var dimensionsAll = 0;
			var dimensions = {
				ios: {
					tabBarHeight: 50,
					marginTop: 20
				},
				android: {
					toolBarHeight: 50,
					summaryBannerHeight: 40,
					tabBarHeight: 50,
					margins: 4
				},
				android4: {
					toolBarHeight: 50,
					summaryBannerHeight: 40,
					tabBarHeight: 50,
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
			this.resetView();
			toolbarController.resetToolbarItems();
			this.viewClass = '';
			if (angular.isString(vref)) vref = new Vref(vref, this.tabIndex);
			this.vref = vref;
			if(dir === 'forward')  {
				var title = toolbarController.getTitleForward(); 
				this.tab.vref.title = title;
				this.tab.history.push(this.tab.vref);
			}
			else {
				if(this.tab.history.length) {
					toolbarController.setBack(this.tab.history[this.tab.history.length-1].title);
				}
				else toolbarController.setBack('');
			}
			this.tab.vref = vref;
			$location.path(vref.raw);
		},
		resetView: function() {
			this.alternateVref = null;
			this.lockOrientation();
		}, 
		setAlternateVref: function(vref) {
			this.alternateVref = vref;
		},
		lockOrientation: function(orientation) {
			platformSpecific.support.orientation.lock(orientation || 'portrait');
		},
		unlockOrientation: function() {
			platformSpecific.support.orientation.unlock();
		},
		handleOrientationChange: function(orientation) {
			this.orientation = orientation;
			$rootScope.$apply();  // may generate error on first load
			if(this.alternateVref) {
				this.doNavigate(this.alternateVref, 'orientation');
			}
		}
	
	};
	viewsvc.tab = viewsvc.tabs[0]; 
	return viewsvc;
}]);
