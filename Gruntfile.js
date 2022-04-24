// global config
/* const globalConfig = require('./grunt-scripts/globalConfig.json')

const amazonDownload = require('./grunt-scripts/amazon-download/index.js') */
/**
 * @param {Igrunt} grunt
 */
module.exports = function(grunt) {
    // extend grunt
    grunt.myGetConfig = (globalStr, overrideStr) => {
        return this.config.get(overrideStr) || this.config.get(globalStr)
    }
    grunt.initConfig({
        ...require('./grunt-scripts/tasks/prompt'),
        ...require('./grunt-scripts/tasks/config')
    })

    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadTasks('./grunt-scripts/tasks')

    // promp-example
    grunt.registerTask('prompt-example', [
        'prompt:prompt-example', // from grunt-prompt
        'prompt-example-func' // from /tasks/prompt-example
    ])
    // amazon-download
    grunt.registerTask('amazon-download', [
        'prompt:amazon-download',
        'amazon-download-func'
    ])

    // amazon-extact loop
    grunt.registerTask('amazon-extract', [
        'amazon-extract__add-choices', // populate
        'prompt:amazon-extract__select', // select
        'amazon-extract-func', // run
    ])
}