/**
 * @param {IGrunt} grunt
 */
 module.exports = function(grunt) {

    // ================== NEW ====================//
    const NAMESPACE = 'amazon-extract'
    const NEW_MAIN = `${NAMESPACE}-new-main`
    const NEW_POPULATE = `${NAMESPACE}-add-questions`
    const NEXT_STEP = `${NAMESPACE}-next-step`

    grunt.registerTask(NEW_MAIN, function() {
        const done = this.async()
        const pipeAmazonExtractFunc = require('../amazon-extract/amazon-extract-pipes')
        return pipeAmazonExtractFunc()
        .then(done)
    })

    grunt.registerTask(NEW_POPULATE, function() {
        const done = this.async()
        const addChoicesPipe = require('../amazon-extract/amazon-extract__add-choices-pipes')
        return addChoicesPipe()
        .then(done)
    })

    grunt.registerTask(NEXT_STEP, function() {
        grunt.log.writeln('Maybe try the ', 'grunt modify-book'.green, 'script next?')
    })
    
    // =================== BUNDLE ======================== //
    // amazon-extact loop
    grunt.registerTask('amazon-extract', [
        NEW_POPULATE, // populate
        'prompt:amazon-extract__select', // select
        NEW_MAIN,
        NEXT_STEP,
    ])
}