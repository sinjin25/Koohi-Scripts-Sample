/* const QUESTION_FORMAT = {
    config: 'amazon-extract.selectedFile',
    type: 'checkbox',
    message: 'What file would you like to extract from?',
    choices: [],
    default: null,
} */
class GruntPrompt {
    structure = {
        options: {
            questions: []
        }
    }
    questions = this.structure.options.questions

    constructor(dest) {
        this.dest = dest
    }
    addQuestion(options, choices) {
        this.validateQuestion(options)
        this.structure.options.questions.push({
            ...options,
            choices: [...choices]
        })
    }
    validateQuestion(options) {
        const { message, type, config } = options
        if (!message) throw Error('Question requires a "message" prop')
        if (!type) throw Error('Question requires a "type" prop')
        if (!config) throw Error('Question requires a "config" prop')
    }
    commitPrompt() {
        const fse = require('fs-extra')
        return fse.writeFile(`${this.dest}`, JSON.stringify(
            this.structure, null ,4
        ))
        .then(() => {
            return this.structure
        })
        .catch((err) => {
            console.warn('Error creating prompt', err)
            return Promise.reject(err)
        })
    }
}

module.exports = GruntPrompt