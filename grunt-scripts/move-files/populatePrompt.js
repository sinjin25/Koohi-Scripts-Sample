module.exports = function(path, files) {
    const QUESTION_FORMAT = {
        config: 'move-files.selectedFile',
        type: 'checkbox',
        message: 'What files would you like to move?',
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