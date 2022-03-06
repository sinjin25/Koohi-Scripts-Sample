const fse = require('fs-extra')
const path = require('path')
const readLineSync = require('readline-sync')

const { JSONdump } = require('../config.json')
const { NO_CHOICE_SELECTED } = require('../constants')
const JSON_DUMP_AGNOSTIC = JSONdump.split('\\')

const fileIsType = (str, tests) => {
    for (let i = 0; i < tests.length; i++) {
        const m = tests[i]
        if (str.match(m) !== null) return true
    }
    return false
}

const copyFileToLocations = (source, loc, file) => {
    loc.forEach(destination => {
        try {
            console.log('Copying to', path.join(...destination.split('\\'), file))
            fse.copySync(
                source,
                path.join(...destination.split('\\'), file)
            )
        } catch (err) {
            console.error(err)
        }
    })
}

const imageHandler = (destination, destinationFile, cover) => {
    const addMeta = require('../../../utils/addMeta')
    addMeta(destination, destinationFile, ['cover'], cover)
    console.log(`Added cover meta ${cover} to ${destination}/${destinationFile}`)
}

const csvHandler = (destination, destinationFile, csvFile) => {
    const addMeta = require('../../../utils/addMeta')
    addMeta(destination, destinationFile, ['filename'], csvFile)
    console.log(`Added filename meta ${csvFile} to ${destination}/${destinationFile}`)
}

const addAsMeta = (selectedFile, metaName, callback) => {
    const addAsMeta = readLineSync.keyInYN(`Would you like to add ${selectedFile} as the ${metaName} for a book?\n`)
    if (!addAsMeta) return
    const jsonFiles = fse.readdirSync(path.join(...JSON_DUMP_AGNOSTIC))
    const jsonFileIndex = (jsonFiles.length > 0)
        ? readLineSync.keyInSelect(jsonFiles, 'Select a file\n')
        : -1
    if (jsonFileIndex !== NO_CHOICE_SELECTED) {
        const f = jsonFiles[jsonFileIndex]
        callback(path.join(...JSON_DUMP_AGNOSTIC), f, selectedFile)
    } else {
        console.log('No file picked. Aborting'.red)
        process.exit(0)
    }
}

module.exports = {
    fileIsType,
    copyFileToLocations,
    imageHandler,
    csvHandler,
    addAsMeta,
}