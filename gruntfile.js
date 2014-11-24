var DEMO_COUCH_DB = 'http://localhost:5984/ilm-app';
module.exports = function (grunt) {

	var cssFiles = [
		'source/assets/css/site.css',
		'source/assets/css/style.css'
	];


	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: '<config:lint.files>',
            tasks: 'default'
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true,
                node: true,
                es5: true
            },
            globals: {}
        },
        mkcouchdb: {
            demo: {
                db: DEMO_COUCH_DB
            }
        },
        rmcouchdb: {
            demo: {
                db: DEMO_COUCH_DB,
                options: {
                    okay_if_missing: true
                }
            }
        },
        couchapp: {
            demo: {
                db: DEMO_COUCH_DB,
                app: './demo/app.js'
            }
        },

		cssmin: {

			options : {
				 banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
			combine: {
				files: {
					'source/css/<%= pkg.name %>.min.css' :cssFiles
				}
			}

		}

	});

	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadTasks('tasks');
	grunt.registerTask('default', ['cssmin']);
	grunt.registerTask('buildcss', ['cssmin']);
	grunt.registerTask('demo', 'rmcouchdb:demo mkcouchdb:demo couchapp:demo');
	
}