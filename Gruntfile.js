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
        prompt: {
            "prompt-example": grunt.file.readJSON('grunt-scripts/tasks/prompt/prompt-example.json'),
            "amazon-download": grunt.file.readJSON('grunt-scripts/tasks/prompt/amazon-download.json'),
        },
        ...grunt.file.readJSON('grunt-scripts/tasks/config/globalConfig.json'),
        amazonDownload: {...grunt.file.readJSON('grunt-scripts/tasks/config/amazon-download.json')},
        "prompt-example": grunt.file.readJSON('grunt-scripts/tasks/config/prompt-example.json')
    })
    grunt.loadNpmTasks('grunt-prompt');
    grunt.loadTasks('./grunt-scripts/tasks') // this is interferring
    /* grunt.registerTask('prompt-test', [
        'prompt:ex',
        'example-using-prompt'
    ]) */
    grunt.registerTask('prompt-example', [
        'prompt:prompt-example', // from grunt-prompt
        'prompt-example-func' // from /tasks/prompt-example
    ])
    grunt.registerTask('amazon-download', [
        'prompt:amazon-download',
        'amazon-download-func'
    ])
}