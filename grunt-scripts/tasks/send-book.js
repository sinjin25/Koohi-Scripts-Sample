/**
 * @param {IGrunt} grunt
 */
 module.exports = function(grunt) {
    const NAMESPACE = 'send-book'
    const MAIN = `${NAMESPACE}-func`
    const PREVIEW = `${NAMESPACE}__preview`
    const ADD_CHOICES = `${NAMESPACE}__add-choices`
    const ASK_FILE = `prompt:send-book`
    const ASK_PROCEED = `prompt:simple-confirm`
    const META = `${NAMESPACE}__meta-func`

    grunt.registerTask(ADD_CHOICES, function() {
        const getFiles = require('../util/getFiles')
        const path = require('path')
        const src = grunt.myGetConfig('dest', `${NAMESPACE}.dest`)
        const done = this.async()
        const PROMPT_PATH = path.join(__dirname, 'prompt', 'send-book.json')
        return getFiles(src, function(anItem) {
            return anItem.isFile() && anItem.name.match(/json$/)
        })
        .then((files) => {
            const GruntPrompt = require('../util/createPrompt')
            const prompt = new GruntPrompt(PROMPT_PATH)
            prompt.addQuestion(
                {
                    type: 'list',
                    config: `${NAMESPACE}.selectedFile`,
                    message: 'What JSON file do you want to send?',
                    default: null,
                }, files.map((i) => ({ name: i.name, value: {...i} }))
            )
            return prompt.commitPrompt()
        })
        .then((data) => {
            grunt.config('prompt.send-book', data)
            return done()
        })
    })

    grunt.registerTask(PREVIEW, function() {
        const file = grunt.config(`${NAMESPACE}.selectedFile`)
        const PATH_TO_FILE = file.path
        const data = require(PATH_TO_FILE)
        const bookPreview = require('../send-book/bookPreview')
        bookPreview(data)
    })

    grunt.registerTask(MAIN, function() {
        if (!grunt.config.get('proceed')) {
            grunt.warn('Aborted')
            return
        }
        // get url to server
        // convert
        const BASE_URL = grunt.config(`${NAMESPACE}.baseUrl`)
        const RECOUNT_URL = grunt.config(`${NAMESPACE}.recountUrl`)
        const PASS = grunt.config(`${NAMESPACE}.pass`)

        const file = grunt.config(`${NAMESPACE}.selectedFile`)
        const PATH_TO_FILE = file.path
        const data = require(PATH_TO_FILE)
        const done = this.async()
        return Promise.resolve()
        .then(() => {
            const sendBook = require('../send-book/request')
            return sendBook(data, {BASE_URL, PASS})
        })
        .then((response) => {
            console.log('resp', response.slice(-1))
            const actions = []
            const logResponse = require('../send-book/logResponse')
            const sendRecount = require('../send-book/recountRequest')
            const dest = grunt.myGetConfig('dest', `${NAMESPACE}.dest`)
            actions.push(logResponse(dest, file.name, response))
            actions.push(sendRecount({ PASS, RECOUNT_URL }))

            return Promise.all(actions)
        })
        .then(([insertId, recountResp]) => {
            grunt.config(`${NAMESPACE}.insertId`, insertId)
            done()
        })
        .catch((err) => {
            grunt.warn(err)
            done()
        })
    })

    grunt.registerTask(META, function() {
        const insertId = grunt.config.get(`${NAMESPACE}.insertId`)
        const FILE = grunt.config(`${NAMESPACE}.selectedFile`)
        const PATH_TO_FILE = FILE.path
        const META_URL = grunt.config.get(`${NAMESPACE}.metaUrl`)
        const PASS = grunt.config(`${NAMESPACE}.pass`)
        const data = require(PATH_TO_FILE)
        
        const done = this.async()
        return Promise.resolve()
        .then(() => {
            const sendMeta = require('../send-book/metaRequest')
            return sendMeta(data, {META_URL, PASS, insertId})
        })
        .then((response) => {
            const logResponse = require('../send-book/logResponse')
            const dest = grunt.myGetConfig('dest', `${NAMESPACE}.dest`)

            return logResponse(dest, `meta-${FILE.name}`, response)
        })
        .then(() => {
            grunt.log.writeln('Try "grunt zip" next?')
            return done()
        })
    })

    // ===================== BUNDLE ==================== //
    grunt.registerTask(`${NAMESPACE}`, [
        ADD_CHOICES,
        ASK_FILE,
        PREVIEW,
        ASK_PROCEED,
        MAIN,
        META
    ])

    grunt.registerTask('send-meta', [
        ADD_CHOICES,
        ASK_FILE,
        PREVIEW,
        ASK_PROCEED,
        META
    ])
 }