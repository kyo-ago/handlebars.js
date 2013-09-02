var childProcess = require('child_process');

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true
      },
      files: [
        'lib/**/!(parser|browser-prefix|browser-suffix).js'
      ]
    },

    concat: {
      options: {
        banner: '/*!\n\n <%= pkg.name %> v<%= pkg.version %>\n\n<%= grunt.file.read("LICENSE") %>\n@license\n*/\n',
        process: function(src, name) {
          var match = /\/\/ BEGIN\(BROWSER\)\n((?:.|\n)*)\n\/\/ END\(BROWSER\)/.exec(src);
          return '\n// ' + name + '\n' + (match ? match[1] : src);
        },
        separator: ';'
      },
      dist: {
        src: [
          'lib/handlebars/browser-prefix.js',
          'lib/handlebars/base.js',
          'lib/handlebars/compiler/parser.js',
          'lib/handlebars/compiler/base.js',
          'lib/handlebars/compiler/ast.js',
          'lib/handlebars/utils.js',
          'lib/handlebars/compiler/compiler.js',
          'lib/handlebars/compiler/javascript-compiler.js',
          'lib/handlebars/runtime.js',
          'lib/handlebars/browser-suffix.js'
        ],
        dest: 'dist/handlebars.js'
      },
      runtime: {
        src: [
          'lib/handlebars/browser-prefix.js',
          'lib/handlebars/base.js',
          'lib/handlebars/utils.js',
          'lib/handlebars/runtime.js',
          'lib/handlebars/browser-suffix.js'
        ],
        dest: 'dist/handlebars.runtime.js'
      }
    },
    uglify: {
      options: {
        mangle: true,
        compress: true,
        preserveComments: 'some'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
      runtime: {
        src: 'dist/<%= pkg.name %>.runtime.js',
        dest: 'dist/<%= pkg.name %>.runtime.min.js'
      }
    },
    watch: {
      scripts: {
        files: [
          'lib/handlebars/compiler/compiler.js',
          'spec/*.js'
        ],
        tasks: ['shell'],
        options: {
          spawn: false
        }
      }
    },
    shell: {
      nodeTest: {
        options: {
          stdout: true,
          stderr: true
        },
        command: 'npm test'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadTasks('tasks');

  grunt.registerTask('dist-dir', function() {
    grunt.file.delete('dist');
    grunt.file.mkdir('dist');
  });
  grunt.registerTask('test', function() {
    var done = this.async();

    var runner = childProcess.fork('./spec/env/runner', [], {stdio: 'inherit'});
    runner.on('close', function(code) {
      if (code != 0) {
        grunt.fatal(code + ' tests failed');
      }
      done();
    });
  });
  grunt.registerTask('bench', ['metrics']);

  grunt.registerTask('build', ['jshint', 'parser', 'dist-dir', 'concat', 'uglify', 'test']);
  grunt.registerTask('default', 'build');
  grunt.registerTask('default', 'build');
  grunt.registerTask('watchTest', ['shell', 'watch']);
};
