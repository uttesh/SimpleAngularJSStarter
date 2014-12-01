'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var AppConfig = {
    app: 'app',
    dist: 'dist'
  };

  grunt.initConfig({
    rivet: AppConfig,
    watch: {

      livereload: {
        files: [
          '<%= rivet.app %>/{,*/}*.html',
          '{.tmp,<%= rivet.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= rivet.app %>}/scripts/{,*/}*.js',
          '<%= rivet.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
	  bower : {
            install : {
                options : {
                    targetDir : 'lib',
                    cleanup : false,            
                    layout : 'byComponent',    
                    verbose : true,            
                },
            },
        },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, AppConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= rivet.dist %>/*',
            '!<%= rivet.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%= rivet.app %>/scripts/{,*/}*.js'
      ]
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    concat: {
      dist: {
        files: {
          '<%= rivet.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%= rivet.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%= rivet.app %>/index.html',
      options: {
        dest: '<%= rivet.dist %>'
      }
    },
    usemin: {
      html: ['<%= rivet.dist %>/{,*/}*.html'],
      css: ['<%= rivet.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= rivet.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= rivet.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%= rivet.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= rivet.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%= rivet.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/rivet/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= rivet.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%= rivet.dist %>'
        }]
      }
    },
    cdnify: {
      dist: {
        html: ['<%= rivet.dist %>/*.html']
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= rivet.dist %>/scripts',
          src: '*.js',
          dest: '<%= rivet.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= rivet.dist %>/scripts/scripts.js': [
            '<%= rivet.dist %>/scripts/scripts.js'
          ],
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%= rivet.dist %>/scripts/{,*/}*.js',
            '<%= rivet.dist %>/styles/{,*/}*.css',
            '<%= rivet.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
            '<%= rivet.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= rivet.app %>',
          dest: '<%= rivet.dist %>',
          src: [
            '*.{ico,txt}',
            '.htaccess',
            'components/**/*',
            'images/{,*/}*.{gif,webp}'
          ]
        }]
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
	'copy',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'connect:test',
   ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'ngmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', ['build']);
};
