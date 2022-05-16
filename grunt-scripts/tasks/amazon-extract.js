/**
 * @param {IGrunt} grunt
 */
 module.exports = function(grunt) {
    grunt.registerTask('amazon-extract-func', function() {
        const fse = require('fs-extra')
        const extract = require('../amazon-extract/extract')
        const path = require('path')
        const readDownloadLog = require('../amazon-extract/read-download-log')
        const downloadImage = require('../amazon-extract/downloadImage')

        const done = this.async()
        const dest = grunt.myGetConfig('dest', 'amazon-extract.dest')
        const src = grunt.myGetConfig('src', 'amazon-extract.src')
        const dataSrc = grunt.config('dataSrc')
        const files = grunt.config.get('amazon-extract.selectedFile')

        const mergeWithDefaultData = require('../amazon-extract/mergeWithDefaultData')

        grunt.log.writeln(`files.length ${files.length}`)
        const actions = files.map(aFile => { // for each file...
            // get the web page
            return fse.readFile(path.join(src, aFile), { encoding: 'utf-8'})
            .then((data) => {
                // extract the data into an object
                return extract(data)
            })
            .then((bookInfo) => { // 2. add "info meta"
                return readDownloadLog(grunt.config.get('dest'), aFile)
                .catch(() => {
                    return false
                })
                .then((foundUrl) => {
                    if (foundUrl) bookInfo.info = foundUrl
                    return bookInfo
                })
            })
            .then((bookInfo) => { // 3. download cover, update "cover" meta if possible
                return Promise.resolve()
                .then(() => {
                    if (!bookInfo?.cover) return Promise.reject('no cover info')
                    const filename = bookInfo.cover.split('/').slice(-1)[0]

                    return downloadImage(bookInfo.cover, path.join(dataSrc, filename))
                    .then(() => {
                        bookInfo.cover = filename
                    })
                })
                .catch((err) => {
                    grunt.log.writeln(err)
                    return
                })
                .then(() => bookInfo)
            })
            .then((bookInfo) => { // 4. write the file
                return fse.writeFile(
                    path.join(dest, `${aFile}.json`),
                    JSON.stringify(mergeWithDefaultData(bookInfo), null, 4)
                )
                .then(() => {
                    console.log(`\n\n${aFile} delivered to ${dest}\n\n`.green)
                })
            })
        })
        return Promise.allSettled(actions)
        .then(done)
    })
    grunt.registerTask('amazon-extract__add-choices', function() {
        const fse = require('fs-extra')
        const path = require('path')
        const populate = require('../amazon-extract/populatePrompt')
        // read dir, add choices
        const done = this.async()
        const src = grunt.myGetConfig('src', 'amazon-extract.src')
        // readdir
        fse.readdir(src, { encoding: 'utf-8'})
        .then((files) => {
            return files.filter(i => i.match(/.htm/))
        })
        .then((files) => {
            return populate(
                path.join('./', 'grunt-scripts', 'tasks', 'prompt', 'amazon-extract', 'select.json'),
                files
            )
        })
        .then(() => {
            grunt.config('prompt:amazon-extract__select', require('./prompt/amazon-extract/select.json'))
            done()
        })
    })

    // =================== BUNDLE ======================== //
    // amazon-extact loop
    grunt.registerTask('amazon-extract', [
        'amazon-extract__add-choices', // populate
        'prompt:amazon-extract__select', // select
        'amazon-extract-func', // run
    ])
}