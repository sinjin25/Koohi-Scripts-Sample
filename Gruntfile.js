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
    const promptsConfig = require('./grunt-scripts/tasks/prompt')
    const configConfig = require('./grunt-scripts/tasks/config')

    grunt.initConfig({
        prompt: {...promptsConfig},
        ...configConfig
    })

    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadTasks('./grunt-scripts/tasks')

    grunt.registerTask('default', function() {
        grunt.log.writeln('grunt is working')
    })

    grunt.registerTask('test-prompts', function() {
        grunt.log.writeln(Object.keys(promptsConfig).join(','))
        const x = grunt.config('prompt')
        grunt.log.writeln(Object.keys(x).join(','))
    })

    // promp-example
    grunt.registerTask('prompt-example', [
        'prompt:prompt-example', // from grunt-prompt
        'prompt-example-func' // from /tasks/prompt-example
    ])
}