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
        }

    });


        // jshint: {
        //     src: ["Gruntfile.js", "client/scripts/main.js"]
        // }
    grunt.registerTask('default', ['uglify',  'sass', 'cssmin']);
    grunt.registerTask("build", ['uglify', 'sass', 'cssmin']);

};
