// global config
/* const globalConfig = require('./grunt-scripts/globalConfig.json')

const amazonDownload = require('./grunt-scripts/amazon-download/index.js') */
/**
 * @param {Igrunt} grunt
 */
/* module.exports = function(grunt) {
    grunt.config.init(globalConfig)

    // amazon-download
    grunt.registerTask('amazon-download', amazonDownload)
} */

module.exports = function(grunt) {
    /* grunt.registerTask('amazon-download', function(qa) { */
        /* let done = this.async() */
        /* require('./grunt-scripts/amazon-download/index.js')(grunt)
        .then(() => {
            done()
        }) */
        /* require('./grunt-scripts/amazon-download/index.js')(grunt)
    }) */
    grunt.initConfig({
        test: {}
    })
    grunt.loadTasks('./grunt-scripts/tasks')
}