module.exports = function(grunt) {
    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("muchslide.jquery.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
                " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
		" *  <%= pkg.description %>\n" +
		" *  <%= pkg.homepage %>\n" +
		" *\n" +
		" *  Made by <%= pkg.author.name %>\n" +
		" *  Under <%= pkg.licenses[0].type %> License\n" +
		" */\n"
	},

	// Concat definitions
	concat: {
	    dist: {
		src: ["src/jquery.muchslide.js"],
		dest: "dist/jquery.muchslide.js"
	    },
	    options: {
		banner: "<%= meta.banner %>"
	    }
	},

	// Lint definitions
	jshint: {
	    files: ["src/jquery.muchslide.js"],
	    options: {
		jshintrc: ".jshintrc"
	    }
	},

	// Minify definitions
	uglify: {
	    my_target: {
		src: ["dist/jquery.muchslide.js"],
		dest: "dist/jquery.muchslide.min.js"
	    },
	    options: {
		banner: "<%= meta.banner %>"
	    }
	},

        watch: {
            options: {
                livereload: true
            },
            // LINT JS AND MINIFY
            js: {
                files: ["src/jquery.muchslide.js"],
                tasks: ["jshint", "concat", "uglify"],
                options: {
                    spawn: false,
                    debounceDelay: 1000
                }
            }
        },

    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["jshint", "concat", "uglify"]);
    grunt.registerTask("travis", ["jshint"]);

};
