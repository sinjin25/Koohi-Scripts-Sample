/**
 * @param {IGrunt} grunt
 */
 module.exports = function(grunt) {
    const NAMESPACE = 'extract-readability'

    grunt.registerTask(`${NAMESPACE}`, function() {
        const path = require('path')
        const src = grunt.myGetConfig('dataSrc', `${NAMESPACE}.dataSrc`)
        const dest = grunt.myGetConfig('dest', `${NAMESPACE}.dest`)

        const readReadabilityDump = require('../readability/read-readability-dump')
        const logReadability = require('../readability/log-readability')
        const formatReadability = require('../readability/format-readability')

        const done = this.async()
        return readReadabilityDump(src)
        .then((promiseResults) => {
            return promiseResults
            .filter((i) => i.status === 'fulfilled')
            .map((i) => {
                return i.value.replace('\r\n', '')
            })
        })
        .then((rawData) => {
            return rawData.map((aRow) => {
                return formatReadability(aRow, [
                    '???', 'score', 'filename'
                ])
            }).flat(99) // cuz technically supports mutliple rows per file, but thats not how the data is formatted
        })
        .then((formattedData) => {
            const actions = []
            let chain = Promise.resolve()
            for (let aRow of formattedData) {
                chain = chain.then(() => logReadability(path.join(dest, 'readability-log.csv'), aRow))
            }
            return chain
        })
        .then(() => {
            grunt.log.writeln('Try "grunt modify-book" next?')
            return done()
        })
        .catch((err) => {
            grunt.warn(err)
        })
    })
 }