// require colors
// require readLineSync
// get config destination, output folder

require('colors')
const path = require('path')
const readLineSync = require('readline-sync')
const fse = require('fs-extra')

// CONSTANTS
const { destination, dump } = require('./03-modify-book/config.json')
const DESTINATION_AGNOSTIC = destination.split('\\')
const DUMP_AGNOSTIC = dump.split('\\')
const {
    NO_CHOICE_SELECTED,
    CHOICES,
    REQUIRED_KEYS,
} = require('./03-modify-book/constants.js')

// ask for file to modify
let fileIndex = null
const files = fse.readdirSync(path.join(...DUMP_AGNOSTIC)).filter(i => i.match(/.json/) !== null)
if (files.length === 0) {
    console.log("No files in dump folder".red, path.join(...DUMP_AGNOSTIC))
    process.exit(0)
}
fileIndex = readLineSync.keyInSelect(files, 'Select a JSON to modify'.green)
selectedFile = files[fileIndex]

// look for missing keys
const checkRequiredKeys = require('../utils/requiredKeys')
const missing = checkRequiredKeys(path.join(...DESTINATION_AGNOSTIC, selectedFile), REQUIRED_KEYS)
if (missing.length > 0) {
    console.log('REQUIRED KEYS MISSING'.red)
    console.log('missing', missing)
} else {
    console.log('No missing required keys'.green)
}
const removeMissing = (key, REQUIRED_KEYS) => {
    const missingIndex = missing.findIndex(i => i === key)
    if (missingIndex >= 0) missing.splice(missingIndex, 1)
    console.log('Currently missing keys'.red, missing)
}

// ask for a key and value to modify
let keys = []
let values = []
let choiceIndex = null
while (choiceIndex !== NO_CHOICE_SELECTED) {
    choiceIndex = readLineSync.keyInSelect(CHOICES, 'Select a key to modify\n'.green)
    if (choiceIndex !== NO_CHOICE_SELECTED) {
        const choice = CHOICES[choiceIndex]
        // ask for a value
        const value = readLineSync.question('Enter a value for the key ', choice)
        if (value) {
            keys.push(choice)
            values.push(value)
            removeMissing(choice)
        }
    }
}

// use helper function to add meta to json
if (!keys.length > 0 || !values.length > 0) {
    console.log('No keys chosen to be modified'.red)
    process.exit(0)
}
const confirmMap = keys.map((i, index) => `${keys[index]}: ${values[index]}`)
const confirmMsg = `Adding to ${selectedFile}\n${confirmMap.join('\n')}`.blue
console.log(confirmMsg)
if (readLineSync.keyInYN('Would you like to commit these changes?'.green)) {
    const addMeta = require('../utils/addMeta')
    addMeta(path.join(...DESTINATION_AGNOSTIC), selectedFile, keys, values)
}