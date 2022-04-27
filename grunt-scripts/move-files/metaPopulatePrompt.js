module.exports = function(path, files, message = 'What JSON file do you want to add the metadata to?') {
    const QUESTION_FORMAT = {
        config: 'move-files.selectedJSON',
        type: 'list',
        message,
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