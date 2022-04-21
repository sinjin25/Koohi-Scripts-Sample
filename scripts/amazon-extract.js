// check dump for webpage complete files
// ask to pick a file
// ask to name the project
// extract information you can
// write to said JSON file

require('colors')
const HTMLParser = require('node-html-parser')
const fse = require('fs-extra')
const path = require('path')
const readLineSync = require('readline-sync')
const {
    NO_CHOICE_SELECTED, JSON_WHITE_SPACE
} = require('./01-amazon-extract/constants.js')

// utils
const Extractor = require('./01-amazon-extract/utils/extractor')
const readDownloadLog = require('./01-amazon-extract/utils/read-download-log')

// folder locations
const {
    destination, dump
} = require('./01-amazon-extract/config.json')
const { readlinkSync } = require('fs-extra')
const DESTINATION_AGONISTC = path.join(...destination.split('\\'))
const DUMP_AGNOSTIC = path.join(...dump.split('\\'))
const OUTPUT = path.join(DESTINATION_AGONISTC)

// read dir, show options
const files = fse.readdirSync(DUMP_AGNOSTIC, {encoding: 'utf-8'}).filter(i => i.match(/.htm/))
if (files.length === 0) {
    console.log('No files in dump folder', DUMP_AGNOSTIC)
    process.exit(0)
}
let fileIndex = null
while(fileIndex !== NO_CHOICE_SELECTED) {
    console.log(files)
    fileIndex = readLineSync.keyInSelect(files, 'Select a file to extract from\n', {
        encoding: 'utf-8',
    })

    if (fileIndex !== NO_CHOICE_SELECTED) {
        const activeFile = files[fileIndex]

        const fileContents = fse.readFileSync(path.join(DUMP_AGNOSTIC, activeFile), {
            encoding: 'utf-8'
        })
    
        const root = HTMLParser.parse(fileContents)
        const bookInfo = {}
        Extractor.routine(root, bookInfo)
    
        const fileName = readLineSync.question('Input file name?\n')
        fse.ensureDirSync(OUTPUT)

        readDownloadLog(activeFile)
        .catch(() => {
            const msg = `Could not find ${activeFile} in the downloads log`
            console.log(msg.red)
            return false
        })
        .then((foundUrl) => {
            if (foundUrl) bookInfo.info = foundUrl
            fse.writeFile(
                path.join(OUTPUT, `${fileName}.json`),
                JSON.stringify(bookInfo, null, JSON_WHITE_SPACE)
            )
            .then(() => {
                console.log(`\n\n${fileName} delivered to ${OUTPUT}\n\n`.green)
            })
        })
    }
}