module.exports = function(grunt) {
 
  grunt.initConfig({
 
    clean: {
        src: ['platforms/ios/www', 'platforms/android/www', 'platforms/android4/www']
    },


    less: {
      development: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: {
          "www/css/app.css": "www/css/app.less"
        }
      }
    },


    copy: {
      all: {
        files: [
          {expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/ios/www'},
          {expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/android/www'},
          {expand: true, cwd: 'www', src: ['**', '!**/*.less', '!**/*.bat', '!**/*.psd'], dest: 'platforms/android4/www'}
        ]
      },
      merge: {
        files: [
          {expand: true, cwd: 'merges/ios', src: ['**'], dest: 'platforms/ios/www'},
          {expand: true, cwd: 'merges/android', src: ['**'], dest: 'platforms/android/www'},
          {expand: true, cwd: 'merges/android4', src: ['**'], dest: 'platforms/android4/www'}
        ]
      }
    }

 
  });
 

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  
  grunt.registerTask('default', ['clean', 'less', 'copy']);

};