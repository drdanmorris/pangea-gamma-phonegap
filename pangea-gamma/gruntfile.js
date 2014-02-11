module.exports = function(grunt) {
 
	grunt.initConfig({
		
		//==============================================
		// clean
		//==============================================
		clean: {
			ios_www : {
				src: [
					'platforms/ios/www/css', 
					'platforms/ios/www/img', 
					'platforms/ios/www/js',
					'platforms/ios/www/lib']
			},
			android_www : {
				src: [
					'platforms/android/assets/www/css', 
					'platforms/android/assets/www/img', 
					'platforms/android/assets/www/js',
					'platforms/android/assets/www/lib']
			},
			ios_all : {
				src: 'platforms/ios'
			},
			android_all : {
				src: ['platforms/android', 'plugins/android.json']
			},
			staging : {
				src: ['stylus/staging', 'www/js/staging']
			},
			reset: {
				src: ['plugins/*', 'platforms/*']
			},
			ios_js: {
				src: ['platforms/ios/www/js/*.js']
			},
			android_js: {
				src: ['platforms/android/assets/www/js/*.js']
			}

		},


		//==============================================
		// stylus
		//==============================================
		stylus: {

			ios: {
				options: {
					paths: ['stylus']
				},
				files: {
					'platforms/ios/www/css/app.css': ['stylus/staging/*.styl', 'stylus/ios/platform.styl']
				}
			},

			android: {
				options: {
					paths: ['stylus']
				},
				files: {
					'platforms/android/assets/www/css/app.css': ['stylus/staging/*.styl', 'stylus/android/platform.styl']
				}
			},

			android4: {
				options: {
					paths: ['stylus']
				},
				files: {
					'platforms/android/assets/www/css/app.css': ['stylus/staging/*.styl', 'stylus/android4/platform.styl']
				}
			}

		},


		//==============================================
		// copy
		//==============================================
		copy: {
			commoninit: {
				files: [
					{expand: true, cwd: 'stylus/base', src: ['**/*.styl'], dest: 'stylus/staging'}
				]
			},

			iosinit: {
				files: [
					{src: 'stylus/ios/platform-overrides.styl', dest: 'stylus/staging/platform-overrides.styl'}
				]
			},
			ios: {
				files: [
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'merges/ios', src: ['**'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'phonegap_tweaks/platform/ios', src: ['**'], dest: 'platforms/ios'},
					{expand: true, cwd: 'www/js/staging', src: ['angular.js', 'app.js'], dest: 'platforms/ios/www/js'},
					{src: 'www/lib/underscore.js', dest: 'platforms/ios/www/js/underscore.js'}
				]
			},

			fix_ios_plugins: {
				files: [
					{expand: true, cwd: 'plugins/org.apache.cordova.device/src/ios', src: ['**'], dest: 'platforms/ios/pangea-gamma/Plugins/org.apache.cordova.device'}
				]
			},

			androidinit: {
				files: [
					{src: 'stylus/android/platform-overrides.styl', dest: 'stylus/staging/platform-overrides.styl'}
				]
			},
			android: {
				files: [
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/android/assets/www'},
					{expand: true, cwd: 'merges/android', src: ['**'], dest: 'platforms/android/assets/www'},
					{expand: true, cwd: 'phonegap_tweaks/platform/android', src: ['**'], dest: 'platforms/android'},
					{expand: true, cwd: 'www/js/staging', src: ['angular.js', 'app.js'], dest: 'platforms/android/assets/www/js'},
					{src: 'www/lib/underscore.js', dest: 'platforms/android/assets/www/js/underscore.js'}
				]
			},

			android4init: {
				files: [
					{src: 'stylus/android4/platform-overrides.styl', dest: 'stylus/staging/platform-overrides.styl'}
				]
			}
		},


		
		//==============================================
		// exec
		//==============================================
		exec: {
			prepare_ios : {
				command: 'phonegap build ios'
			},
			prepare_android : {
				command: 'phonegap build android'
			},
			add_plugin_device : {
				command: 'phonegap local plugin add https://git-wip-us.apache.org/repos/asf/cordova-plugin-device.git'
			},
			add_plugin_websocket : {
				command: 'phonegap local plugin add https://github.com/drdanmorris/phonegap-websocket'
			},
			add_plugin_orientation : {
				command: 'phonegap local plugin add https://github.com/drdanmorris/pg-plugin-screen-orientation'
			}
		},


		//==============================================
		// edit_config_feature
		//==============================================
		edit_config_feature: {
			ios_device: {
				src: 'platforms/ios/pangea-gamma/config.xml',
				feature: '<feature name="Device"><param name="ios-package" value="CDVDevice" /></feature>'
			}
		},


		//==============================================
		// edit_index_html
		//==============================================
		edit_index_html: {
			ios: {
				src: 'platforms/ios/www/index.html'
			},
			android: {
				src: 'platforms/android/assets/www/index.html'
			}
		},


		//==============================================
		// uglify
		//==============================================
		uglify: {
			android: {
				files: {
				'platforms/android/assets/www/js/all.js.min': [
					'platforms/android/assets/www/js/angular.js', 
					'platforms/android/assets/www/js/underscore.js', 
					'platforms/android/assets/www/js/platform.js', 
					'platforms/android/assets/www/js/app.js']
				}
			},
			ios: {
				files: {
				'platforms/ios/www/js/all.js.min': [
					'platforms/ios/www/js/angular.js', 
					'platforms/ios/www/js/underscore.js', 
					'platforms/ios/www/js/platform.js', 
					'platforms/ios/www/js/app.js']
				}
			}
		},



		//==============================================
		// concat
		//==============================================
		concat: {
			options: {
				separator: ';\n',
			},
			services: {
				src: 'www/js/services/*.js',
				dest: 'www/js/staging/services.js'
			},
			controllers: {
				src: 'www/js/controllers/*.js',
				dest: 'www/js/staging/controllers.js'
			},
			app: {
				src: [
					'www/js/types.js', 
					'www/js/polyfills.js', 
					'www/js/index.js', 
					'www/js/app.js', 
					'www/js/services.js',
					'www/js/staging/services.js',
					'www/js/userControls.js', 
					'www/js/controllers.js', 
					'www/js/staging/controllers.js', 
					'www/js/filters.js', 
					'www/js/directives.js', 
					'www/js/index.js'],

				dest: 'www/js/staging/app.js'
			},
			angular: {
				src: [
					'www/lib/angular/angular.js',
					'www/lib/angular/angular-route.js',
					'www/lib/angular/angular-animate.js',
					'www/lib/angular/angular-touch.js'],

				dest: 'www/js/staging/angular.js'
			}
		}


	});
 

	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-exec');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	//==============================================
	// custom tasks
	//==============================================
	grunt.task.registerMultiTask('edit_config_feature', 'Add a feature to config.xml', function() {
		var fs = require('fs');
		var file = this.files[0].src[0];
		var feature = this.files[0].feature;

		if(fs.existsSync(file)) {
			var data = fs.readFileSync(file, {encoding: 'utf8'});
			grunt.log.writeln('editing file ' + file);
			var updated = data.replace('</widget>', '\t' + feature + '\n</widget>')
			fs.writeFileSync(file, updated);
		} 
		else {
			grunt.log.writeln('****' + file + ' does not exist****');
		}
	});


	grunt.task.registerMultiTask('edit_index_html', 'Tweak JS scripts in index.html', function() {
		var fs = require('fs');
		var file = this.files[0].src[0];
		var feature = this.files[0].feature;

		if(fs.existsSync(file)) {
			var data = fs.readFileSync(file, {encoding: 'utf8'});
			grunt.log.writeln('editing file ' + file);
			var startmatch = '<!--app js start',
				startpos = data.indexOf(startmatch), 
				endmatch = '<!--app js end-->',
				endpos = data.indexOf(endmatch);

			if(endpos > startpos) {
				var outfile = data.substring(0,startpos) + '\n\t<script src="js/all.js.min"></script>' + data.substring(endpos + endmatch.length);
				fs.writeFileSync(file, outfile);
			}
		} 
		else {
			grunt.log.writeln('****' + file + ' does not exist****');
		}

	});


	// Common
	grunt.registerTask('reset', ['clean:reset']);
	grunt.registerTask('common', ['clean:staging', 'concat', 'copy:commoninit']);
	grunt.registerTask('add-plugins', ['exec:add_plugin_device']);


	// Android
	grunt.registerTask('android', ['common', 'clean:android_www', 'copy:androidinit', 'stylus:android', 'copy:android']);
	grunt.registerTask('android4', ['common', 'clean:android_www', 'copy:android4init', 'stylus:android4', 'copy:android']);
	grunt.registerTask('add-android', ['clean:android_all', 'exec:prepare_android']); 
	grunt.registerTask('add-plugins-android', ['exec:add_plugin_websocket', 'exec:add_plugin_orientation']);


	// iOS
	grunt.registerTask('ios', ['common', 'clean:ios_www', 'copy:iosinit', 'stylus:ios', 'copy:ios']);
	grunt.registerTask('add-ios', ['clean:ios_all', 'exec:prepare_ios']);


	// Windows (android + WP8)
	grunt.registerTask('windows', ['android']);	



	// 1) Master installation tasks
	grunt.registerTask('install-android', ['reset', 'add-android', 'add-plugins', 'add-plugins-android', 'exec:prepare_android', 'android']);
	grunt.registerTask('install-ios', ['reset', 'add-ios', 'add-plugins', 'exec:prepare_ios', 'ios']);


	// 2) iOS Fix (optional - check if still required)
	grunt.registerTask('fix_ios_plugins', ['edit_config_feature:ios_device', 'copy:fix_ios_plugins']);


	// 3) Default www update
	grunt.registerTask('default', ['ios', 'android']);


	// 4) Production-ready
	grunt.registerTask('prod-ios', ['uglify:ios', 'clean:ios_js', 'edit_index_html:ios']);	
	grunt.registerTask('prod-android', ['uglify:android', 'clean:android_js', 'edit_index_html:android']);


};