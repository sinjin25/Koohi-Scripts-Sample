// conversion of amazon-extract utils to pipes
// all assume the existence of "grunt" and this.async() in the context

// general
const fse = require('fs-extra')
const path = require('path')
const pipe = require('../../utils/compose')
const grunt = require('grunt')
require('colors')
const addNS = require('../../utils/nsPrefix')('amazon-extract')

const createPrompt = (dest) => {
    const GruntPrompt = require('../util/createPrompt')
    return () => {
        return new GruntPrompt(dest)
    }
}

const addQuestionToPrompt = (files) => {
    return (pipedData) => {
        pipedData.addQuestion(
            {
                type: 'checkbox',
                config: `amazon-extract.selectedFile`,
                message: 'What file would you like to extract from?',
                default: null,
            }, files.map((i) => ({ name: i, checked: false, }))
        )
        return pipedData
    }
}

const commitPrompt = () => { // return the json data
    return (pipedData) => {
        return pipedData.commitPrompt()
    }
}

const reconfigurePrompt = (configKey) => {
    // config the shit
    return (pipedData) => {
        grunt.config(configKey, pipedData)
        return pipedData
    }
}

// pipe: for amazon-extract-func
/**
 * @param {IGrunt} grunt
 */
 const thePipe = async () => {
    const getFromConfig = require('../../utils/getFromConfig')
    const context = await pipe(
        getFromConfig([addNS('.dest'), 'dest'], 'DEST'),
        getFromConfig([addNS('.src'), 'src'], 'SRC'),
    )({})
    const {
        SRC, DEST,
    } = context
    console.log('context'.blue, SRC, DEST)
    const RECONFIGURE_KEY = 'prompt.amazon-extract__select'
    const actions = []
    // setup config
    actions.push(
        Promise.resolve()
        .then(() => {
            // get files
            return fse.readdir(SRC, { encoding: 'utf-8'})
            .then((files) => {
                return files.filter(i => i.match(/.htm/))
            })
        })
        .then((files) => {
            return pipe(
                createPrompt(path.join('./', 'grunt-scripts', 'tasks', 'prompt', 'amazon-extract', 'select.json')),
                addQuestionToPrompt(files),
                commitPrompt(),
                reconfigurePrompt(RECONFIGURE_KEY),
            )()
        })
        
    )
    return Promise.allSettled(actions)
    .then((res) => {
        console.log('res', res)
        return res
    })
}

module.exports = thePipe