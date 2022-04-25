module.exports = function(path, files) {
    const QUESTION_FORMAT = {
        config: 'rn-raw-files.selectedFile',
        type: 'list',
        message: 'What file do you want to rename the mecab output files based on?',
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