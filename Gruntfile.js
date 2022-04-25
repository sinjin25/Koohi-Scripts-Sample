require('colors')
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
        grunt.log.writeln('Grunt is working. Tasks to run directly include:')
        const TASKS = {
            DOWNLOAD_AMAZON: {
                task: "grunt download-amazon".green,
                description: `Download a (product) page from amazon. Follow up with the extract-amazon script`.blue
            },
            EXTRACT_AMAZON: {
                task: "grunt extract-amazon".green,
                description: `Extract the book meta out of an amazon page. Use before 'move-files' etc.`.blue
            },
            RENAME_RAW_FILES: {
                task: "grunt rename-raw-files".green,
                description: `Rename the output files from mecab analysis (readability report, word freq report) and the book cover (cover.xxx) into a specific format`.blue
            },
            MOVE_FILES: {
                task: "grunt move-files".green,
                description: `Move the renamed files from 'rename-raw-files' to the correct directories for the application (MYSQL upload folder, cover folder, etc.)`.blue
            },
        }
        const keys = Object.keys(TASKS)
        keys.forEach((aKey) => {
            const { task, description } = TASKS[aKey]
            grunt.log.writeln(`* ${task}:`)
            grunt.log.writeln(description)
            grunt.log.writeln(`--------------`)
        })
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