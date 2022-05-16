/**
 * @param {IGrunt} grunt
 */
 module.exports = function(grunt) {
    const NAMESPACE = 'zip'
    const ADD_CHOICES = `${NAMESPACE}__add-choices`
    const MAIN = `${NAMESPACE}-func`
    const PROMPT = `prompt:zip`

    grunt.registerTask(ADD_CHOICES, function() {
        const path = require('path')
        const PATH_TO_PROMPT = path.join(__dirname, 'prompt', 'zip.json')
        const GruntPrompt = require('../util/createPrompt')
        const done = this.async()

        return Promise.resolve()
        .then(() => {
            const prompt = new GruntPrompt(PATH_TO_PROMPT)
            return prompt
        })
        .then((prompt) => {
            const getFiles = require('../util/getFiles')
            return getFiles(grunt.myGetConfig('dataSrc', `${NAMESPACE}.dataSrc`))
            .then((files) => {
                prompt.addQuestion({
                    type: 'checkbox',
                    message: 'What files do you want to archive?',
                    config: `${NAMESPACE}.selectedFiles`
                }, files.map(
                    (i) => ({name: i.name, value: {...i}, checked: false})
                ))
            })
            .then(() => prompt)
        })
        .then((prompt) => {
            const genreList = grunt.config(`${NAMESPACE}.BOOK_TYPES`)
            prompt.addQuestion(
                {
                    type: 'list',
                    message: 'What genre do you want to file this under?',
                    default: null,
                    config: `${NAMESPACE}.selectedGenre`
                },
                genreList.map(i => ({ name: i, value: i}))
            )
            return prompt
        })
        .then((prompt) => {
            prompt.addQuestion({
                type: 'input',
                message: 'What do you want to name the archive?',
                config: `${NAMESPACE}.selectedArchiveName`
            }, [])
            return prompt.commitPrompt()
        })
        .then(() => {
            grunt.config('prompt.zip', require('./prompt/zip.json'))
            done()
        })
    })

    grunt.registerTask(MAIN, function() {
        const fse = require('fs-extra')
        const path = require('path')

        const filesToZip = grunt.config(`${NAMESPACE}.selectedFiles`)
        const zipCategory = grunt.config(`${NAMESPACE}.selectedGenre`)
        const archiveName = grunt.config(`${NAMESPACE}.selectedArchiveName`)
        const PATH = path.join(
            grunt.config(`${NAMESPACE}.dest`),
            zipCategory,
            archiveName
        )
        const done = this.async()

        if (filesToZip.length === 0) grunt.warn('No files were selected')
        return fse.ensureDir(PATH)
        .then(() => {
            const zipPath = path.join(PATH, `${archiveName}.zip`)

            const output = require('../zip/setupOutput')(zipPath)
            const archive = require('../zip/setupArchiver')(output, {
                level: grunt.config(`${NAMESPACE}.ZLIB_BEST_COMPRESSION`)
            })
            return archive
        })
        .then((archive) => {
            const actions = []
            filesToZip.forEach(file => {
                actions.push(
                    archive.append(
                        fse.createReadStream(file.path),
                        { name: file.name }
                    )
                )
            })
            return Promise.all(actions)
            .then(() => {
                return archive.finalize()
            })
        })
        .then(done)
    })

    // ========== BUNDLE ============== //
    grunt.registerTask('zip', [
        ADD_CHOICES,
        PROMPT,
        MAIN,
    ])
}