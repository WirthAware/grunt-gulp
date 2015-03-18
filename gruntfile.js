module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-newer');

    var taskConfig = {

        pkg: grunt.file.readJSON("package.json"),
        config: grunt.file.readJSON("config_grunt.json"),

        meta: {
            banner: '/**\n' +
                ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * <%= pkg.homepage %>\n' +
                ' *\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
                ' */\n'
        },

        clean: {
            all: ['<%= config.paths.dest.base %>']
        },

        html2js: {
            app: {
                src: ['<%= config.paths.source.html %>'],
                dest: '<%= config.paths.dest.debug %>/src/app/templates-app.js'
            }
        },

        copy: {
            debug: {
                src: [
                    '<%= config.paths.source.js %>',
                    '<%= config.paths.source.css %>',
                    '<%= config.paths.source.vendor.js %>',
                    '<%= config.paths.source.vendor.css %>',
                    '<%= config.paths.source.vendor.assets %>',
                    '<%= config.paths.source.img %>'
                ],
                dest: '<%= config.paths.dest.debug %>/',
                cwd: '.',
                expand: true
            },
            release: {
                files: [{
                    src: ['<%= config.paths.source.vendor.assets %>'],
                    dest: '<%= config.paths.dest.release %>/src/fonts/',
                    expand: true,
                    flatten: true
                }, {
                    src: ['<%= config.paths.source.img %>'],
                    dest: '<%= config.paths.dest.release %>/',
                    expand: true
                }]
            }
        },

        concat: {
            css: {
                src: [
                    '<%= config.paths.source.vendor.css %>',
                    '<%= config.paths.source.css %>'
                ],
                dest: '<%= config.paths.dest.release %>/src/css/<%= pkg.name %>-<%= pkg.version %>.css'
            },
            js: {
                src: [
                    '<%= config.paths.source.vendor.js %>',
                    '<%= config.paths.dest.debug %>/src/**/*.js',
                    '<%= html2js.app.dest %>'
                ],
                dest: '<%= config.paths.dest.release %>/src/js/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        },

        uglify: {
            release: {
                options: {
                    banner: '<%= meta.banner %>'
                },
                files: {
                    '<%= concat.js.dest %>': '<%= concat.js.dest %>'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: 'jshintrc.json'
            },
            all: ['<%= config.paths.source.js %>']
        },

        index: {
            debug: {
                dir: '<%= config.paths.dest.debug %>',
                src: [
                    '<%= config.paths.source.vendor.js %>',
                    '<%= config.paths.source.vendor.css %>',
                    '<%= config.paths.source.vendor.assets %>',
                    '<%= config.paths.dest.debug %>/src/**/*.js',
                    '<%= config.paths.dest.debug %>/src/**/*.css'
                ]
            },
            release: {
                dir: '<%= config.paths.dest.release %>',
                src: [
                    '<%= concat.js.dest %>',
                    '<%= concat.css.dest %>'
                ]
            }
        },

        connect: {
            options: {
                open: true,
                hostname: 'localhost'
            },
            debug: {
                options: {
                    port: 9000,
                    livereload: true,
                    base: '<%= config.paths.dest.debug %>'
                }
            },
            release: {
                options: {
                    port: 9001,
                    keepalive: true,
                    livereload: false,
                    base: '<%= config.paths.dest.release %>'
                }
            }
        },

        watch: {
            options: {
                livereload: true,
            },

            js: {
                files: [
                    '<%= config.paths.source.js %>'
                ],
                tasks: ['newer:jshint:all', 'newer:copy:debug']
            },

            css: {
                files: [
                    '<%= config.paths.source.css %>'
                ],
                tasks: ['newer:copy:debug']
            },

            html: {
                files: ['<%= config.paths.source.html %>'],
                tasks: ['html2js']
            },

            index: {
                files: ['<%= config.paths.source.index_grunt %>'],
                tasks: ['index:debug']
            }
        }
    };

    grunt.initConfig(taskConfig);

    grunt.registerTask('default', ['debug', 'release', 'serve']);

    grunt.registerTask('debug', ['clean', 'jshint', 'html2js', 'copy:debug', 'index:debug']);

    grunt.registerTask('release', ['copy:release', 'concat:css', 'concat:js', 'uglify', 'index:release']);

    grunt.registerTask('serve', ['connect:debug', 'watch']);

    grunt.registerMultiTask('index', 'Process index.html template', function() {
        var debug = grunt.template.process('<%= config.paths.dest.debug %>');
        var release = grunt.template.process('<%= config.paths.dest.release %>');
        var base = new RegExp('^(' + debug + '|' + release + ')\/', 'g');

        var jsFiles = filterForJS(this.filesSrc).map(function(file) {
            return file.replace(base, '');
        });

        var cssFiles = filterForCSS(this.filesSrc).map(function(file) {
            return file.replace(base, '');
        });

        var template = grunt.template.process('<%= config.paths.source.index_grunt %>');
        grunt.file.copy(template, this.data.dir + '/index.html', {
            process: function(contents) {
                return grunt.template.process(contents, {
                    data: {
                        scripts: jsFiles,
                        styles: cssFiles
                    }
                });
            }
        });
    });

    function filterForJS(files) {
        return files.filter(function(file) {
            return file.match(/\.js$/);
        });
    }

    function filterForCSS(files) {
        return files.filter(function(file) {
            return file.match(/\.css$/);
        });
    }
};
