module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-sync');

    var taskConfig = {

        pkg: grunt.file.readJSON("package.json"),
        config: grunt.file.readJSON("config.json"),

        clean: {
            all: ['<%= config.paths.dest.base %>']
        },

        copy: {
            debug: {
                src: [
                    '<%= config.paths.source.js %>',
                    '<%= config.paths.source.html %>',
                    '!<%= config.paths.source.index %>',
                    '!<%= config.paths.source.index_grunt %>',
                    '<%= config.paths.source.css %>',
                    '<%= config.paths.source.vendor.js %>',
                    '<%= config.paths.source.vendor.css %>',
                    '<%= config.paths.source.vendor.assets %>',
                    '<%= config.paths.source.img %>',
                    '<%= config.paths.source.md %>',
                ],
                dest: '<%= config.paths.dest.base %>/',
                cwd: '.',
                expand: true
            },
            release: {
                //TODO
            }
        },

        index: {
            debug: {
                dir: '<%= config.paths.dest.base %>',
                src: [
                    '<%= config.paths.source.vendor.js %>',
                    '<%= config.paths.source.vendor.css %>',
                    '<%= config.paths.source.vendor.assets %>',
                    '<%= config.paths.dest.base %>/src/**/*.js',
                    '<%= config.paths.dest.base %>/src/**/*.css'
                ]
            },

            release: {
                dir: '<%= compile_dir %>',
                src: [
                    '<%= concat.compile_js.dest %>',
                    '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
                ]
            }
        },

        connect: {
            options: {
                open: true,
                livereload: true,
                hostname: 'localhost',
            },
            app: {
                options: {
                    port: 9000,
                    base: ['<%= config.paths.dest.base %>/src', '<%= config.paths.dest.base %>']
                }
            }
        },

        sync: {
            options: {
                verbose: true // Display log messages when copying files 
            },
            js: {
                files: [{
                    src: ['<%= config.paths.source.js %>'],
                    dest: '<%= config.paths.dest.base %>/'
                }],
                verbose: true
            },

            html: {
                files: [{
                    src: [
                        '<%= config.paths.source.html %>',
                        '!<%= config.paths.source.index %>',
                        '!<%= config.paths.source.index_grunt %>'
                    ],
                    dest: '<%= config.paths.dest.base %>/'
                }],
                verbose: true
            },

            css: {
                files: [{
                    src: ['<%= config.paths.source.css %>'],
                    dest: '<%= config.paths.dest.base %>/'
                }],
                verbose: true
            },

            md: {
                files: [{
                    src: ['<%= config.paths.source.md %>'],
                    dest: '<%= config.paths.dest.base %>/'
                }],
                verbose: true
            }
        },

        watch: {
            options: {
                livereload: true,
            },

            js: {
                files: ['<%= config.paths.source.js %>'],
                tasks: ['sync:js']
            },

            html: {
                files: ['<%= config.paths.source.html %>'],
                tasks: ['sync:html']
            },

            css: {
                files: ['<%= config.paths.source.css %>'],
                tasks: ['sync:css']
            },

            md: {
                files: ['<%= config.paths.source.md %>'],
                tasks: ['sync:md']
            },

            index: {
            	files: ['<%= config.paths.source.index_grunt %>'],
                tasks: ['index:debug']
            }
        }
    };

    grunt.initConfig(taskConfig);

    grunt.registerTask('debug', [
        'clean',
        'copy:debug',
        'index:debug',
        'connect',
        'watch'
    ]);

    grunt.registerMultiTask('index', 'Process index.html template', function() {
        var base = grunt.template.process('<%= config.paths.dest.base %>/');

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
