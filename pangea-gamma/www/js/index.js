/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
	initialize: function() {
		console.log('app.initialize');
		this.bindEvents();
	},
	initOrientation: function() {

		if(screenOrientation) {
			//alert('screenOrientation defined')
			console.log('locking orientation to portrait');
			screenOrientation.set('portrait');
		}

	},
	bindEvents: function() {
		document.addEventListener('deviceready', function() {
			app.deviceReady();
		}, false);
	},
	deviceReady: function() {
		console.log('Device Ready');
		angular.bootstrap(document, ["myApp"]);
		this.initOrientation();
	}
	
};


var appController;  // master application controller


// Orientation support (iOS)
// 1 = UIInterfaceOrientationPortrait
// 2 = UIInterfaceOrientationPortraitUpsideDown
// 3 = UIInterfaceOrientationLandscapeLeft
// 4 = UIInterfaceOrientationLandscapeRight
function shouldRotateToOrientation(interfaceOrientation) {
	console.log('shouldRotateToOrientation ' +  interfaceOrientation);
	return (1 === interfaceOrientation); // support portrait only
}
function doOnOrientationChange()
{
	// if we got this far then we assume that shouldRotateToOrientation() indicated that rotation was valid
	// for the current view.
	if(appController) {
		switch(window.orientation) 
		{  
			case -90:
			case 90:
				appController.handleOrientationChange('landscape');
				break;

			default:
				appController.handleOrientationChange('portrait');
				break; 
		}
	}
}
window.addEventListener('orientationchange', doOnOrientationChange);

