module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        // We need to specify app/ subdirectories since we don't want to
        // accidentily lint anything in app/.meteor/ or app/packages/
        'Gruntfile.js',
        'app/client/**/*.js',
        'app/lib/**/*.js',
        'app/server/**/*.js',
        'tasks/**/*.js',
        'test/**/*.js'
      ],

      options: {
        jshintrc: true
      }
    },

    complexity: {
      generic: {
        src: [
          'app/client/**/*.js',
          'app/lib/**/*.js',
          'app/server/**/*.js',
          'tasks/**/*.js',
          'test/**/*.js'
        ],
        options: {
          cyclomatic: 7,
          halstead: 13,
          maintainability: 90
        }
      }
    },

    build: {
      default: {
        dir: 'build/'
      },

      test: {
        dir: 'buildtest/'
      }
    },

    clean: {
      default: ['build/'],
      test: [
        '*.tar.gz',
        '*.zip',
        'buildtest/',
        'coverage/',
      ]
    },

    fixtures: {
      default: {
        dir: 'build/'
      },

      test: {
        dir: 'buildtest/'
      }
    },

    istanbul: {
      // Bring up express server with istanbul connect middleware
      startServer: {},

      // Download coverage data from istanbul express server
      // and kill server.
      stopServer: {},

      // Instrument javascript
      instrument: {
        paths: [
          'buildtest/client/*.js',
          'buildtest/client/controllers/*.js',
          'buildtest/lib/**/*.js'
        ]
      }
    },

    // Client-side unit tests with mocha
    mocha: {
      test: {
        src: ['test/unit/index.html'],
        options: {
          log: true,
          logErrors: true,
          reporter: 'Spec',
          run: false
        }
      }
    },

    // Selenium webdriver tests
    mochaTest: {
      webdriver: {
        options: {
          reporter: 'spec',
          require: 'test/integration/setup.js',
          timeout: '60s'
        },
        src: [
          'test/integration/bootstrap_test.js',
          'test/integration/deckbuilder_test.js',
          'test/integration/decks_test.js',
          'test/integration/game_test.js',
          'test/integration/games_test.js',
          'test/integration/login_test.js'
        ]
      }
    },

    watch: {
      build: {
        files: ['app/**/*'],
        tasks: ['incremental']
      }
    }
  });

  grunt.loadNpmTasks('grunt-complexity');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadTasks('./tasks');
  grunt.task.registerTask('default', [
    'clean:test',
    'jshint',                // Lint
    'complexity',
    // Instrument all the things and start the coverage server
    // before we run unit and integration tests in the browser.
    // We will post data to the coverage server from the browser.
    'build:test',
    'istanbul:instrument',
    'istanbul:startServer',
    'mocha',                 // Client-side unit test suite
    'mochaTest',             // WebDriverJs integration test suite
    'istanbul:stopServer'
  ]);
};
