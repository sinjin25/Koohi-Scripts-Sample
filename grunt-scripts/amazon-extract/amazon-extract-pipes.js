// conversion of amazon-extract utils to pipes
// all assume the existence of "grunt" and this.async() in the context

// general
const fse = require('fs-extra')
const path = require('path')
const pipe = require('../../utils/compose')
const grunt = require('grunt')
const { promisify } = require('util')
require('colors')
const addNS = require('../../utils/nsPrefix')('amazon-extract')

// task-specific

const readFile = (path) => {
    console.log(path)
    return () => {
        return fse.readFile(path, { encoding: 'utf-8'})
        .catch((err) => {
            console.log('readFile fail', err)
            return Promise.reject(err)
        })
    }
}

const writeFile = (path) => {
    const mergeWithDefaultData = require('./mergeWithDefaultData')
    return (pipedData) => {
        return fse.writeFile(
            path,
            JSON.stringify(mergeWithDefaultData(pipedData), null, 4)
        )
    }
}

const extractFromFile = (pipedData) => {
    const extract = require('./extract')
    return Promise.resolve(pipedData)
    .then(extract)
    .catch((err) => {
        console.log(err.red)
    })
}

const fillOutInfo = (dest, filename) => {
    const readDownloadLog = require('./read-download-log')
    return (data) => {
        return readDownloadLog(dest, filename)
        .catch(() => {
            return false
        })
        .then((foundUrl) => {
            if (foundUrl) return {
                ...data,
                info: foundUrl
            }
            return {...data}
        })
    }
}

const downloadAndFilloutCover = (thePath) => {
    const downloadImage = require('../amazon-extract/downloadImage')
    return (pipedData) => {
        return Promise.resolve()
        .then(() => {
            if (!pipedData?.cover) return Promise.reject('no cover info')
            const filename = pipedData.cover.split('/').slice(-1)[0]

            return downloadImage(pipedData.cover, path.join(thePath, filename))
            .then(() => {
                pipedData.cover = filename
            })
        })
        .catch((err) => {
            grunt.log.writeln(err)
        })
        .then(() => pipedData)
    }
}

// pipe: for amazon-extract-func
/**
 * @param {IGrunt} grunt
 */
const pipeAmazonExtractFunc = async () => {
    const getFromConfig = require('../../utils/getFromConfig')
    const context = await pipe(
        getFromConfig([addNS('.dest'), 'dest'], 'DEST'),
        getFromConfig([addNS('.src'), 'src'], 'SRC'),
        getFromConfig(['dataSrc'], 'DATA_SRC'),
        getFromConfig([addNS('.selectedFile')], 'FILES'),
    )({})
    const {
        SRC, DEST, DATA_SRC, FILES
    } = context
    console.log('pipe', context)
    const actions = FILES.map((aFile) => {
        return pipe(
            readFile(path.join(SRC, aFile)),
            extractFromFile,
            fillOutInfo(DEST, aFile),
            downloadAndFilloutCover(DATA_SRC),
            writeFile(path.join(DEST, `${aFile}.json`)),
        )()
    })
    return Promise.allSettled(actions)
}

module.exports = pipeAmazonExtractFunc