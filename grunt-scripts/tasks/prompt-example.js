// example of using grunt-prompt
module.exports = function(grunt) {
    grunt.registerTask('prompt-example-func', function() {
        grunt.log.writeln(grunt.config.get('prompt-example.question1Answer'))
        grunt.log.writeln(grunt.config.get('prompt-example.question2Answer'))
    })
}