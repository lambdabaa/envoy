module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        // We need to specify app/ subdirectories since we don't want to
        // accidentily lint anything in app/.meteor/ or app/packages/
        'Gruntfile.js',
        'app/client/**/*.js',
        'app/lib/**/*.js',
        'app/private/**/*.js',
        'app/server/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ]
    },

    istanbul: {
      // Server-side unit tests with mocha
      mocha: {
        paths: [
          'test/unit/nodejs/**/*.js',
          'test/unit/shared/**/*.js'
        ]
      },

      // Bring up express server with istanbul connect middleware
      startServer: {},

      // Download coverage data from istanbul express server
      // and kill server.
      stopServer: {},

      // Instrument javascript
      instrument: {
        paths: [
          'app/client/**/*.js',
          'app/lib/**/*.js'
        ]
      },

      restore: {
        paths: [
          'app/client/**/*.js.txt',
          'app/lib/**/*.js.txt'
        ]
      }
    },

    // Client-side unit tests with mocha
    mocha: {
      test: {
        src: ['test/index.html'],
        options: {
          reporter: 'Spec',
          run: true
        }
      }
    },

    // Selenium webdriver tests
    mochaTest: {
      webdriver: {
        options: {
          reporter: 'spec',
          require: 'test/setup.js',
          timeout: '60s'
        },
        src: ['test/integration/**/*_test.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadTasks('./tasks');
  grunt.task.registerTask('default', [
    'jshint',                // Lint
    'istanbul:mocha',        // Server-side unit test suite
    // Instrument all the things and start the coverage server
    // before we run unit and integration tests in the browser.
    // We will post data to the coverage server from the browser.
    'istanbul:instrument',
    'istanbul:startServer',
    'mocha',                 // Client-side unit test suite
    'mochaTest',             // WebDriverJs integration test suite
    'istanbul:stopServer',
    'istanbul:restore'
  ]);
};
