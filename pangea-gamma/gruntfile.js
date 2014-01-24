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
			compile: {
				options: {
					paths: ['www/css/stylus'],
					urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
				},
				files: {
					'www/css/ios.css': ['www/css/stylus/base/*.styl', 'www/css/stylus/ios/*.styl']
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
					{expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.styl', '!**/*.bat', '!**/*.psd'], dest: 'platforms/ios/www'},
					{expand: true, cwd: 'merges/ios', src: ['**'], dest: 'platforms/ios/www'},
					{src: 'platforms/ios/www/css/ios.css', dest: 'platforms/ios/www/css/app.css'}
				]
			},

			androidinit: {
				files: [
					{src: 'www/css/stylus/android/platform-overrides.styl', dest: 'www/css/stylus/base/platform-overrides.styl'}
				]
			},
			android: {
				files: [
					{expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/android/www'},
					{expand: true, cwd: 'merges/android', src: ['**'], dest: 'platforms/android/www'}
				]
			},

			android4init: {
				files: [
					{src: 'www/css/stylus/android4/platform-overrides.styl', dest: 'www/css/stylus/base/platform-overrides.styl'}
				]
			},
			android4: {
				files: [
					{expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/android4/www'},
					{expand: true, cwd: 'merges/android4', src: ['**'], dest: 'platforms/android4/www'}
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
	

	grunt.registerTask('ios', ['clean:ios', 'copy:iosinit', 'stylus', 'copy:ios']);
	grunt.registerTask('android', ['clean:android', 'copy:androidinit', 'stylus', 'copy:android']);
	grunt.registerTask('android4', ['clean:android4', 'copy:android4init', 'stylus', 'copy:android4']);
	grunt.registerTask('default', ['ios', 'android', 'android4']);



};