module.exports = function(grunt) {
 
	grunt.initConfig({
 
		clean: {
			ios_www : {
				src: 'platforms/ios/www'
			},
			android_www : {
				src: 'platforms/android/assets/www'
			},
			ios_all : {
				src: 'platforms/ios'
			},
			android_all : {
				src: ['platforms/android', 'plugins/android.json']
			},
			staging : {
				src: 'stylus/staging'
			},
			reset: {
				src: ['plugins/*', 'platforms/*']
			}
		},



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
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.js','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'merges/ios', src: ['**'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'phonegap_tweaks/platform/ios', src: ['**'], dest: 'platforms/ios'}
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
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.js','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/android/assets/www'},
					{expand: true, cwd: 'merges/android', src: ['**'], dest: 'platforms/android/assets/www'},
					{expand: true, cwd: 'phonegap_tweaks/platform/android', src: ['**'], dest: 'platforms/android'}
				]
			},

			android4init: {
				files: [
					{src: 'stylus/android4/platform-overrides.styl', dest: 'stylus/staging/platform-overrides.styl'}
				]
			}
		},


		sync: {
			ios: {
				files: [
					{expand: true, cwd: 'www/', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'merges/ios', src: ['**'], dest: 'platforms/ios/www'}
				]
			},
			android: {
				files: [
					{expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/android/www'},
					{expand: true, cwd: 'merges/android', src: ['**'], dest: 'platforms/android/www'}
				]
			}
		},


		exec: {
			prepare_ios : {
				command: 'phonegap build ios'
			},
			prepare_android : {
				command: 'phonegap build android'
			},
			add_plugin_device : {
				command: 'phonegap local plugin add org.apache.cordova.device'
			},
			add_plugin_websocket : {
				command: 'phonegap local plugin add https://github.com/drdanmorris/phonegap-websocket'
			}
		},

		edit_config_feature: {
			ios_device: {
				src: 'platforms/ios/pangea-gamma/config.xml',
				feature: '<feature name="Device"><param name="ios-package" value="CDVDevice" /></feature>'
			},
			android_device: {
				src: 'platforms/android/res/xml/config.xml',
				feature: '<feature name="Device"><param name="android-package" value="org.apache.cordova.device.Device" /></feature>'
			}
		}

 
	});
 
	grunt.task.registerMultiTask('edit_config_feature', 'Add a feature to config.xml', function() {
		var done = this.async();
		var fs = require('fs');
		var file = this.files[0].src[0];
		var feature = this.files[0].feature;

		fs.readFile(file, {encoding: 'utf8'}, function(err, data) {
			grunt.log.writeln('editing file ' + file);
			var updated = data.replace('</widget>', '\t' + feature + '\n</widget>')
			//grunt.log.writeln(updated);
			fs.writeFileSync(file, updated);
		});

		grunt.log.writeln(this.target + ': ' + this.data);

		done(true);

	});


	grunt.registerTask('fix_ios_plugins', ['edit_config_feature:ios_device', 'copy:fix_ios_plugins']);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sync');
	grunt.loadNpmTasks('grunt-exec');

	grunt.registerTask('ios', ['clean:staging', 'copy:commoninit', 'copy:iosinit', 'stylus:ios', 'copy:ios']);
	grunt.registerTask('android', ['clean:staging', 'copy:commoninit', 'copy:androidinit', 'stylus:android', 'copy:android']);
	grunt.registerTask('android4', ['clean:staging', 'copy:commoninit', 'copy:android4init', 'stylus:android4', 'copy:android']);
	grunt.registerTask('default', ['ios', 'android']);

	grunt.registerTask('platform-ios', ['clean:ios_all', 'exec:prepare_ios', 'exec:add_plugin_device']);
	grunt.registerTask('platform-android', ['clean:android_all', 'exec:prepare_android', 'exec:add_plugin_device', 'exec:add_plugin_websocket']);  // ]);// 
	



};