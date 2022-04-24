module.exports = function(path, files) {
    const QUESTION_FORMAT = {
        config: 'amazon-extract.selectedFile',
        type: 'checkbox',
        message: 'What file would you like to extract from?',
        choices: [],
        default: null,
    }
    const PROMPT_BASE = {
        "options": {
            "questions": []
        }
    }

    const data = {...PROMPT_BASE}
    // modify choices
    const arr = []
    files.forEach((i) => {
        arr.push({
            name: i,
            checked: false,
        })
    })
    data.options.questions = [
        QUESTION_FORMAT
    ]
    data.options.questions[0].choices = [...arr]

    const fse = require('fs-extra')
    return fse.writeFile(`${path}`, JSON.stringify(
        data, null, 4
    ))
}