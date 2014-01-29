module.exports = function(grunt) {
 
	grunt.initConfig({
 
		clean: {
			ios : {
				src: 'platforms/ios/www'
			},
			android : {
				src: 'platforms/android/www'
			},
			android4 : {
				src: 'platforms/android4/www'
			}
		},




		stylus: {
			ios: {
				options: {
					paths: ['www/css/stylus']
				},
				files: {
					'www/css/ios.css': ['www/css/stylus/base/*.styl', 'www/css/stylus/ios/*.styl']
				}
			},
			android: {
				options: {
					paths: ['www/css/stylus']
				},
				files: {
					'www/css/android.css': ['www/css/stylus/base/*.styl', 'www/css/stylus/android/*.styl']
				}
			},
			android4: {
				options: {
					paths: ['www/css/stylus']
				},
				files: {
					'www/css/android4.css': ['www/css/stylus/base/*.styl', 'www/css/stylus/android4/*.styl']
				}
			}
		},


		copy: {
			iosinit: {
				files: [
					{src: 'www/css/stylus/ios/platform-overrides.styl', dest: 'www/css/stylus/base/platform-overrides.styl'}
				]
			},
			ios: {
				files: [
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.js','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'merges/ios', src: ['**'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'phonegap_tweaks/platforms/ios', src: ['**'], dest: 'platforms/ios'},
					{src: 'www/css/ios.css', dest: 'platforms/ios/www/css/app.css'}
				]
			},

			androidinit: {
				files: [
					{src: 'www/css/stylus/android/platform-overrides.styl', dest: 'www/css/stylus/base/platform-overrides.styl'}
				]
			},
			android: {
				files: [
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.js','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/android/www'},
					{expand: true, cwd: 'merges/android', src: ['**'], dest: 'platforms/android/www'},
					{expand: true, cwd: 'phonegap_tweaks/platforms/android', src: ['**'], dest: 'platforms/android'},
					{src: 'www/css/android.css', dest: 'platforms/android/www/css/app.css'}
				]
			},

			android4init: {
				files: [
					{src: 'www/css/stylus/android4/platform-overrides.styl', dest: 'www/css/stylus/base/platform-overrides.styl'}
				]
			},
			android4: {
				files: [
					{expand: true, cwd: 'www', src: ['**/*.xml','**/*.html','**/*.json','**/*.js','**/*.map','**/*.png','**/*.jpg','**/*.svg'], dest: 'platforms/android4/www'},
					{expand: true, cwd: 'merges/android4', src: ['**'], dest: 'platforms/android4/www'},
					{expand: true, cwd: 'phonegap_tweaks/platforms/android4', src: ['**'], dest: 'platforms/android4'},
					{src: 'www/css/android4.css', dest: 'platforms/android4/www/css/app.css'}
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
			},
			android4: {
				files: [
					{expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/android4/www'},
					{expand: true, cwd: 'merges/android4', src: ['**'], dest: 'platforms/android4/www'}
				]
			}
		}

 
	});
 

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-sync');
	

	grunt.registerTask('ios', ['clean:ios', 'copy:iosinit', 'stylus:ios', 'copy:ios']);
	grunt.registerTask('android', ['clean:android', 'copy:androidinit', 'stylus:android', 'copy:android']);
	grunt.registerTask('android4', ['clean:android4', 'copy:android4init', 'stylus:android4', 'copy:android4']);
	grunt.registerTask('default', ['ios', 'android', 'android4']);



};