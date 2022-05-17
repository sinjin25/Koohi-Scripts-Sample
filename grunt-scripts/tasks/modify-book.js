/**
 * @param {IGrunt} grunt
 */
module.exports = function(grunt) {
    const NAMESPACE = 'modify-book'
    const MAIN = `${NAMESPACE}-func`
    const LOOP = `${NAMESPACE}__loop`
    const ADD_CHOICES = `${NAMESPACE}__add-choices`
    const ADD_CHOICES_FIELD = `${NAMESPACE}__add-choices-field`
    const ASK_FILE = `prompt:modify-book__select`
    const ASK_FIELD = `prompt:modify-book__field-select`
    const ASK_LOOP =`prompt:simple-loop-confirm`

    grunt.registerTask(ADD_CHOICES, function() {
        const path = require('path')
        const getFiles = require('../util/getFiles')
        const src = grunt.myGetConfig('dest', `${NAMESPACE}.dest`)
        const done = this.async()
        const PATH_TO_PROMPT = path.join(__dirname, 'prompt', 'modify-book', 'select.json')

        return getFiles(src, function(anItem) {
            return anItem.isFile() && anItem.name.match(/\.htm*.?\.json$/)
        })
        .then((files) => {
            const GruntPrompt = require('../util/createPrompt')
            const prompt = new GruntPrompt(PATH_TO_PROMPT)
            prompt.addQuestion(
                {
                    type: 'list',
                    config: `${NAMESPACE}.selectedFile`,
                    message: 'What JSON file do you want to modify?',
                    default: null,
                }, files.map((i) => ({ name: i.name, value: {...i} }))
            )
            return prompt.commitPrompt()
        })
        .then((data) => {
            grunt.config(`prompt.modify-book__select`, data)
        })
        .then(done)
    })

    grunt.registerTask(ADD_CHOICES_FIELD, function() {
        const path = require('path')
        const getFields = require('../modify-book/getMissingFields')
        const done = this.async()
        const selectedFile = grunt.config(`${NAMESPACE}.selectedFile`)
        const PATH_TO_PROMPT = path.join(__dirname, 'prompt', 'modify-book', 'field-select.json')

        const item = require(selectedFile.path)
        return Promise.resolve(item)
        .then(getFields)
        .then((options) => {
            const { CHOICES, missing } = options
            // construct prompt
            const GruntPrompt = require('../util/createPrompt')
            const fieldPrompt = new GruntPrompt(PATH_TO_PROMPT)
            const allFields = Array.from(new Set([...missing, '---', ...CHOICES]))
            // ask for field
            require('colors')
            fieldPrompt.addQuestion(
                {
                    type: 'list',
                    config: `${NAMESPACE}.selectedFieldToModify`,
                    message: 'What field do you want to modify?',
                    default: null,
                }, allFields.map((i) => {
                    return {
                        name: missing.includes(i) ? i.red : i.green,
                        value: i,
                    }
                })
            )
            fieldPrompt.addQuestion(
                {
                    type: 'input',
                    config: `${NAMESPACE}.selectedFieldValue`,
                    message: 'What value for the field?',
                    default: null,
                }, []
            )
            return fieldPrompt.commitPrompt()
        })
        .then((data) => {
            grunt.config('prompt.modify-book__field-select', data)
            return done()
        })
    })

    grunt.registerTask(MAIN, function() {
        // modify file
        const fse = require ('fs-extra')
        const done = this.async()
        const selectedFile = grunt.config(`${NAMESPACE}.selectedFile`)
        const fieldToModify = grunt.config(`${NAMESPACE}.selectedFieldToModify`)
        const newFieldValue = grunt.config(`${NAMESPACE}.selectedFieldValue`)
        const workingObj = grunt.config(`${NAMESPACE}.workingObject`) || require(selectedFile.path) // get around cache of json file
        
        grunt.log.writeln(`${selectedFile} ${fieldToModify} ${newFieldValue}`)
        
        return fse.writeFile(
            selectedFile.path,
            JSON.stringify({
                ...workingObj,
                [fieldToModify]: newFieldValue
            }, null, 4)
        )
        .then(() => {
            grunt.config(`${NAMESPACE}.workingObject`, {
                ...workingObj,
                [fieldToModify]: newFieldValue
            })
            return done()
        })
        .catch((err) => {
            grunt.log.error(err)
        })
    })

    // ================ BUNDLE ================ //
    grunt.registerTask(NAMESPACE, [
        ADD_CHOICES,
        ASK_FILE,
        ADD_CHOICES_FIELD,
        ASK_FIELD,
        MAIN,
        ASK_LOOP,
        LOOP,
    ])
    grunt.registerTask(LOOP, function() {
        require('colors')
        if (grunt.config('proceed') === false) {
            console.log('Task finished'.blue, 'try grunt send-book next?'.green)
            const pathToObj = grunt.config(`${NAMESPACE}.selectedFile`).path
            const finalJSON = require(pathToObj)
            console.log(finalJSON)
            return
        }
        grunt.task.run([
            ADD_CHOICES_FIELD,
            ASK_FIELD,
            MAIN,
            ASK_LOOP,
            LOOP,
        ])
    })
}