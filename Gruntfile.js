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
          reporter: 'spec',
          timeout: 10000
        },
        src: ['test/**/*.js']
      }
    },

    browserify: {
      standaloneUMD: {
        src: ['<%= pkg.name %>.js'],
        dest: './browser/dist/<%= pkg.name %>.standalone.js',
        options: {
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        },
      },

      requireUMD: {
        src: ['<%= pkg.name %>.js'],
        dest: './browser/dist/<%= pkg.name %>.require.js',
        options: {
          alias: ['./../<%= pkg.name %>:'],
          external: ['underscore', 'backbone', 'socket.io-stream'],
          browserifyOptions: {
            standalone: '<%= pkg.name %>'
          }
        }
      },

      tests: {
        src: ['browser/test/suite.js'],
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
          'browser/dist/<%= pkg.name %>.standalone.min.js': [
            '<%= browserify.standaloneUMD.dest %>'
          ],
          'browser/dist/<%= pkg.name %>.require.min.js': [
            '<%= browserify.requireUMD.dest %>'
          ],
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
      hostServer: {
        options: {
          port: 8000,
          hostname: '127.0.0.1',
          base: ['.', './browser','./browser/test/']
        }
      }
    },

    jsbeautifier: {
      files: ['*.js', '*.json', 'test/*.js'],
      options: {
        config: './.jsbeautifyrc'
      }
    }
  });

  // Load plug-ins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-jsbeautifier');

  // define tasks
  grunt.registerTask('default', [
    'jsbeautifier',
    'jshint',
    'connect:testServer',
    'mochaTest',
    'browserify',
    'uglify',
  ]);

  grunt.registerTask('test', [
    'jsbeautifier',
    'jshint',
    'connect:testServer',
    'mochaTest',
  ]);

  grunt.registerTask('testServer', [
    'connect:testServer',
    'connect:hostServer:keepalive'
  ]);
};
