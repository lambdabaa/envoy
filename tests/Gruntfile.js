module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'integration/**/*.js',
        'unit/**/*.js',
        '../client/**/*.js',
        '../lib/**/*.js',
        '../server/**/*.js'
      ]
    },

    istanbul: {
      cover: {
        paths: ['unit/lib/**/*.js', 'unit/server/**/*.js']
      }
    },

    mocha: {
      test: {
        src: ['index.html'],
        options: {
          reporter: 'Spec',
          run: true
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: 'setup.js',
          timeout: '10s'
        },
        src: [
          'integration/**/*_test.js',
          'unit/lib/**/*_test.js',
          'unit/server/**/*_test.js',
        ]
      }
    },

    watch: {
      all: {
        files: [
          '<%= jshint.all %>',
          'integration/**/*.json'
        ],
        tasks: [
          'jshint',
          'mocha',
          'mochaTest',
          'istanbul'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadTasks('./tasks');
  grunt.task.registerTask('default', [
    'jshint',
    'mocha',
    'mochaTest',
    'istanbul'
  ]);
};
