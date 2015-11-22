module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require("jit-grunt")(grunt);

    grunt.initConfig({
        uglify: {
            main: {
                src: ["client/scripts/main.js"],
                dest: "client/scripts/main.min.js"
            }
        },
        sass: {
            dist: {
                src: ["client/styles/main.scss"],
                dest: "client/styles/main.css"
            }
        },
        cssmin: {
            main: {
                src: "client/styles/main.css",
                dest: "client/styles/main.min.css"
            }
        },
        jshint: {
            src: ["Gruntfile.js", "client/scripts/main.js", "server/server.js"]
        },
        nodemon: {
            main: {
                script: "server/server.js"
            }
        },
        watch: {
            sass: {
                files: ["client/styles/main.scss"],
                tasks: ["sass", "cssmin"]
            },
            scripts: {
                files: ["client/scripts/main.js"],
                tasks: ["uglify"]
            },
            server: {
                files: ["server/server.js"],
                tasks: ["nodemon"]
            }
        },
        concurrent: {
            target1: ["watch", "nodemon"]
        }
    });



    grunt.registerTask('default', ['uglify', 'sass', 'cssmin', "concurrent:target1"]);
    grunt.registerTask("build", ['uglify', 'sass', 'cssmin']);

};
