module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n',
      },
      dist: {
        src: [
          'public/client/**/*.js',
          // 'public/lib/**/*.js',
        ],
        dest: 'public/build.js',
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

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/buildMin.js': ['public/build.js']
        }
      }
    },

    eslint: {
      target: [
        'public/client/**/*.js',
        'public/lib/**/*.js']
    },

    cssmin: {
      target: {
        files: {
          'public/dist/styleMin.css': ['public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: 'git push live master'
      },
      devServer: {
        command: 'git push origin master'
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    grunt.task.run([ 'nodemon', 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
  ]);

  grunt.registerTask('upload-prod', [
    'shell:prodServer'
  ]);

  grunt.registerTask('upload-dev', [
    'shell:devServer'
  ]);  

  grunt.registerTask('uglifyAll', [
    //uglify files before deployment
    'uglify', 
    'cssmin'
  ]);

  // grunt.registerTask('start', [
  //   //watch source code for changes in order to rerun any grunt tasks as appropriate
  //   'watch',
  //   'nodemon',
  // ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      // add your production server task here
      grunt.task.run([ 'upload-prod' ]);
    } else {
      grunt.task.run([ 'server-dev', 'upload-dev' ]);
    }
  });

  grunt.registerTask('preDeploy', [
    'test',
    'eslint',
    'concat',
    'uglifyAll'
  ]);

  grunt.registerTask('deploy', function(n) {
    console.log(n);
    grunt.task.run([ 'preDeploy']);
    if (grunt.option('prod')) {
      grunt.task.run([ 'server-prod' ]);
    } else {
      grunt.task.run([ 'server-dev']);
    }
  });


};