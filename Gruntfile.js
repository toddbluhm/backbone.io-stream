'use strict';

module.exports = function(grunt) {

  // configure grunt
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        '**/*.js',
        '!node_modules/**/*',
        '!browser/dist/**/*',
        '!browser/example/lib/**/*',
        '!browser/test/browserified_tests.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    // clean: {
    //   dist: ['./browser/dist/**/*'],
    //   tests: ['./browser/test/browserified_tests.js'],
    // },

    browserify: {
      standaloneUMD: {
        src: [ '<%= pkg.name %>.js' ],
        dest: './browser/dist/<%= pkg.name %>.standalone.js',
        options: {
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        },
      },

      requireUMD: {
        src: [ '<%= pkg.name %>.js' ],
        dest: './browser/dist/<%= pkg.name %>.require.js',
        options: {
          alias: [ './../<%= pkg.name %>:' ],
          external: ['underscore', 'backbone', 'socket.io-stream'],
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      },

      tests: {
        src: [ 'browser/test/suite.js' ],
        dest: './browser/test/browserified_tests.js',
        options: {
          exclude: ['jsdom'],
          // Embed source map for tests
          debug: true
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'browser/dist/<%= pkg.name %>.standalone.min.js':
              ['<%= browserify.standaloneUMD.dest %>'],
          'browser/dist/<%= pkg.name %>.require.min.js':
              ['<%= browserify.requireUMD.dest %>'],
        }
      }
    },

    connect: {
      testServer: {
        options: {
          port: 1337,
          hostname: '127.0.0.1',
          onCreateServer: require('./test/testServer')
        }
      },
      phantomServer: {
        options: {
          port: 8000,
          base: '.'
        }
      }
    },

    // run the mocha tests in the browser via PhantomJS
    'mocha_phantomjs': {
      all: {
        options: {
          urls: [
            'http://127.0.0.1:8000/browser/test/index.html'
          ]
        }
      }
    },

  });

  // Load plug-ins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-mocha-phantomjs');

  // define tasks
  grunt.registerTask('default', [
    'jshint',
    'connect:testServer',
    'mochaTest',
    'browserify',
    'uglify',
    'connect:phantomServer',
    'mocha_phantomjs',
  ]);
};
