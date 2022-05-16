/**
 * @param {IGrunt} grunt
 */
 module.exports = function(grunt) {
    const img = [/\.jpg/, /\.jpeg/]
    const csv = [/\.csv/]
    const ACCEPTABLE_TYPES = [...img, ...csv]
    grunt.registerTask('move-files__add-choices', function() {
        const fse = require('fs-extra')
        const path = require('path')

        const populate = require('../move-files/populatePrompt')
        const src = grunt.myGetConfig('dataSrc', 'move-files.dataSrc')
        const done = this.async()

        grunt.log.writeln('src is'+src)
        fse.readdir(src, { encoding: 'utf-8'})
        .then((files) => {
            return files.filter(aFile => {
                for (let i = 0; i < ACCEPTABLE_TYPES.length; i++) {
                    if (aFile.match(ACCEPTABLE_TYPES[i]) !== null) return true
                }
                return false; 
            })
        })
        .then((files) => {
            const PATH = path.join('./', 'grunt-scripts', 'tasks', 'prompt', 'move-files', 'select.json')
            if (files.length === 0) return grunt.warn(`No matching files found in folder ${src}`)
            grunt.log.writeln('files', files)
            return populate(
                PATH,
                files
            )
        })
        .then(() => {
            grunt.config('prompt.move-files__select', require('./prompt/move-files/select.json'))
            done()
        })
    })
    
    grunt.registerTask('move-files-func', function() {
        const copyFileToLocations = require('../move-files/copyFileToLocations')
        const fileIsType = require('../util/fileIsType')
        const files = grunt.config.get('move-files.selectedFile')

        const queue = []
        const itemSet = []
        const done = this.async()
        files.forEach((aFile) => {
            let dest
            if (fileIsType(aFile, [/\.jpg/, /\.jpg/, /\.png/, /\.gif/])) {
                dest = grunt.config.get('move-files.imgLocation')
                itemSet.push(aFile)
            }
            if (fileIsType(aFile, [/\.csv/])) {
                dest = grunt.config.get('move-files.csvLocation')
                itemSet.push(aFile)
            }
            queue.push(
                copyFileToLocations({
                    src: grunt.myGetConfig('dataSrc', 'move-files.dataSrc'),
                    loc: dest,
                    file: aFile,
                })
            )
        })
        return Promise.allSettled(queue)
        .then(() => {
            const set = new Set(itemSet)
            // used for map-prompts
            grunt.config('move-files.filesToMap', Array.from(set))
            done()
        })
    })

    grunt.registerTask('temp', function() {
        grunt.config('move-files.filesToMap', [
            'myFile1.csv', 'myFile2.jpg', 'myFile3.csv',
        ])
        grunt.log.writeln(`manually set move-files.filesToMap as ${grunt.config('move-files.filesToMap').join(',')}`)
    })
    grunt.registerTask('move-files__loop-add-choices', function() {
        const files = grunt.config.get('move-files.filesToMap')
        if (!files || files.length === 0) {
            grunt.log.writeln('Could not find any items in move-files.filesToMap. That means we\'re done.')
            return
        }

        // populate
        const fse = require('fs-extra')
        const path = require('path')

        const populate = require('../move-files/metaPopulatePrompt')
        const src = grunt.myGetConfig('dest', 'move-files.dest')
        const done = this.async()

        return fse.readdir(src, { encoding: 'utf-8'})
        .then((files) => {
            return files.filter(aFile => aFile.match(/.json$/))
        })
        .then((files) => {
            if (files.length === 0) return grunt.warn('No JSON files in output folder')
            const PATH = path.join('./', 'grunt-scripts', 'tasks', 'prompt', 'move-files', 'meta-select.json')
            if (files.length === 0) return grunt.warn(`No matching files found in folder ${src}`)
            return populate(
                PATH,
                ['none', ...files],
                `What JSON file would you like to associate ${grunt.config.get('move-files.filesToMap').slice(0, 1)} with?`
            )
        })
        .then(() => { // modify config
            grunt.config('prompt.move-files__select-meta', require('./prompt/move-files/meta-select.json'))
            done()
        })
        .catch((err) => {
            grunt.warn(err)
        })
    })

    grunt.registerTask('move-files__loop-add-meta', function() {
        // guard
        const done = this.async()
        if (grunt.config.get('move-files.selectedJSON') === 'none') return done()

        const fse = require('fs-extra')
        const path = require('path')
        grunt.log.writeln(
            `Associating ${grunt.config.get('move-files.selectedJSON')} with ${grunt.config.get('move-files.filesToMap').slice(0, 1)}`
        )
        // get JSON
        const destPath = path.join(
            grunt.myGetConfig('dest', 'move-files.dest'), grunt.config.get('move-files.selectedJSON')
        )
        const data = require(destPath)
        const activeFile = new String(
            grunt.config.get('move-files.filesToMap').slice(0, 1)
        )
        grunt.log.writeln(`${activeFile} ${typeof activeFile}`)
        // handle by file type
        return Promise.resolve()
        .then(() => {
            const fileIsType = require('../util/fileIsType')
            if (fileIsType(activeFile, [/\.jpg/, /\.jpg/, /\.png/, /\.gif/])) {
                const addCover = require('../move-files/addCover')
                addCover(
                    activeFile,
                    data
                )
            }
            if (fileIsType(activeFile, [/\.csv/])) {
                const addCsvName = require('../move-files/addCsvName')
                addCsvName(
                    activeFile,
                    data
                )
            }
            return data
        })
        .then((data) => {
            return fse.writeFile(
                destPath,
                JSON.stringify(data, null ,4)
            )
        })
        .then(() => {
            grunt.log.writeln('Meta association successful')
        })
        .catch((err) => {
            grunt.log.writeln(`${err}`)
        })
        .then(done)
    })
    grunt.registerTask('move-files__loop-clean', function() {
        // change filesToMap
        const filesToMap = grunt.config.get('move-files.filesToMap')
        filesToMap.shift()
        grunt.config('move-files.filesToMap', [...filesToMap])
        // change question
        const options = grunt.config.get('prompt.move-files__select-meta.options')
        options.questions[0].message = `What JSON file would you like to associate ${grunt.config.get('move-files.filesToMap').slice(0, 1)} with?`
        grunt.config('prompt.move-files__select-meta.options', options)
        if (filesToMap.length !== 0) {
            grunt.task.run('move-files-meta-loop')
        }
    })

    // ======== BUNDLE =============== //
    // move-files
    grunt.registerTask('move-files', [ // main
        'move-files__add-choices',
        'prompt:move-files__select',
        'move-files-func',
        'move-files-meta'
    ])
    grunt.registerTask('move-files-meta', [ // pre-loop
        'move-files__loop-add-choices',
        'move-files-meta-loop'
    ])
    grunt.registerTask('move-files-meta-loop', [ // loop
        'prompt:move-files__select-meta',
        'move-files__loop-add-meta',
        'move-files__loop-clean',
    ])
 }