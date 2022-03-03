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
} = require('./constants.js')

// utils
const Extractor = require('./utils/extractor')

// folder locations
const {
    destination, dump
} = require('./config.json')
const { readlinkSync } = require('fs-extra')
const DESTINATION_AGONISTC = path.join(...destination.split('\\'))
const DUMP_AGNOSTIC = path.join(...dump.split('\\'))
const OUTPUT = path.join(DESTINATION_AGONISTC)

// read dir, show options
const files = fse.readdirSync(DUMP_AGNOSTIC, {encoding: 'utf-8'}).filter(i => i.match(/.htm/))
let fileIndex = null
while(fileIndex !== NO_CHOICE_SELECTED) {
    console.log(files)
    fileIndex = readLineSync.keyInSelect(files, 'Select a file to extract from', {
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
    
        fse.writeFileSync(
            path.join(__dirname, 'output', `${readLineSync.question('Input file name?')}.json`),
            JSON.stringify(bookInfo, null, JSON_WHITE_SPACE)
        )
    }
}