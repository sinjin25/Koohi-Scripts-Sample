// rename files so that they match a specific order
require('colors')
module.exports = function(grunt) {
    const NAMESPACE = 'rn-raw-files'
    const ACCEPTABLE_TYPES = /\.txt/

    // tasks
    const ADD_CHOICES = 'rn-raw-files__add-choices'
    const MAIN = 'rn-raw-files-func'
    const ROUTINE = 'rn-raw-files'

    grunt.registerTask(ADD_CHOICES, function() {
        const fse = require('fs-extra')
        const path = require('path')

        const populate = require('../rename-raw-files/populatePrompt')
        const src = grunt.myGetConfig('dataSrc', `${NAMESPACE}.dataSrc`)
        const done = this.async()

        fse.readdir(src, { encoding: 'utf-8'})
        .then((files) => files.filter(
            aFile => aFile.match(ACCEPTABLE_TYPES) && aFile.match('read.txt') === null)
        )
        .then((files) => {
            const PATH = path.join('./', 'grunt-scripts', 'tasks', 'prompt', 'rename-raw-files', 'select.json')
            if (files.length === 0) return grunt.warn(`No matching files found in folder ${src}`)
            grunt.log.writeln('files', files)
            return populate(
                PATH,
                files
            )
        })
        .then(() => {
            grunt.config('prompt.rn-raw-files__select', require('./prompt/rename-raw-files/select.json'))
            done()
        })
    })

    grunt.registerTask(MAIN, function() {
        const fse = require('fs-extra')
        const path = require('path')
        const { v4: uuidv4 } = require('uuid')

        const selectedFile = grunt.config(`${NAMESPACE}.selectedFile`)
        grunt.log.writeln(selectedFile)
        const src = grunt.myGetConfig('dataSrc', `${NAMESPACE}.dataSrc`)
        const format = selectedFile.replace(/\.txt/, '')
        const done = this.async()

        const actions = []
        // rename img
        const IMG_NAME = `${format.slice(0, 10)}_${uuidv4()}`
        const renameImg = require('../rename-raw-files/renameImg')
        actions.push(renameImg(src, /cover/, IMG_NAME))

        // rename readability
        const ORIG_READABILITY = 'formula_based_readability_report.txt'
        const NEW_READABILITY_NAME = `${format} read.txt`
        actions.push(
            fse.rename(
                path.join(src, ORIG_READABILITY),
                path.join(src, NEW_READABILITY_NAME)
            )
            .then(() => {
                console.log(`Successfully renamed ${ORIG_READABILITY} to ${NEW_READABILITY_NAME}`.blue)
            })
            .catch((err) => {
                console.log(`Error trying to rename readability`.red)
                console.log(err)
            })
        )

        // rename list
        const ORIG_LIST = 'word_freq_report.txt'
        const NEW_LIST_NAME = `${format}.csv`
        actions.push(
            fse.rename(
                path.join(src, ORIG_LIST),
                path.join(src, NEW_LIST_NAME)
            )
            .then(() => {
                console.log(`Successfully renamed ${ORIG_LIST} to ${NEW_LIST_NAME}`.blue)
            })
            .catch((err) => {
                console.log(`Error trying to rename list`.red)
                console.log(err)
            })
        )

        return Promise.allSettled(actions)
        .then(() => {
            grunt.log.writeln('Try "grunt send-book" next?')
            return done()
        })
    })

    // ============== BUNDLE ================ //
    grunt.registerTask(ROUTINE, [
        ADD_CHOICES,
        'prompt:rn-raw-files__select',
        MAIN,
    ])
}