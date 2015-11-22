module.exports = function(grunt) {

    require('time-grunt')(grunt);
    require("jit-grunt")(grunt);

    grunt.initConfig({
        uglify: {
            main: {
                src: ["scripts/main.js"],
                dest: "scripts/main.min.js"
            }
        },
        sass: {
            dist: {
                src: ["styles/main.scss"],
                dest: "styles/main.css"
            }
        },
        cssmin: {
            main: {
                src: "styles/main.css",
                dest: "styles/main.min.css"
            }
        },
        jshint: {
            src: ["Gruntfile.js", "scripts/main.js"]
        }

    });

    grunt.registerTask('default', ['uglify',  'sass', 'cssmin']);
    grunt.registerTask("build", ['uglify', 'sass', 'cssmin']);

};
