require('colors')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const path = require('path')
const fetch = require('node-fetch')

const {
    FIELDS, JSON_WHITE_SPACE
} = require('./constants.js')
const {
    dump, baseUrl, pass, recountUrl
} = require('./config.json')
const DUMP_AGNOSTIC = path.join(...dump.split('\\'))

// read a JSON file
const files = fse.readdirSync(DUMP_AGNOSTIC).filter(i => i.match(/\.json/))
if (files.length === 0) {
    console.log('No files found. Aborting.'.red)
    process.exit(0)
}
const fileIndex = readLineSync.keyInSelect(files, 'Pick a file\n')
const fileSelected = files[fileIndex]

// submit a preview
const contents = require(path.join(DUMP_AGNOSTIC, fileSelected))
const queryParams = [`pass=${pass}`]
FIELDS.forEach(i => {
    if (contents[i]) {
        console.log(`${i}: ${contents[i]}`)
        queryParams.push(`${i}=${contents[i]}`)
    } else {
        console.log(`MISSING i`.red)
    }
})

// confirm the user wants to continue
const confirm = readLineSync.keyInYN('Would you like to commit to submitting this to the server?')
if (!confirm) {
    console.log('Aborting'.red)
    process.exit(0)
}

// submit to server
const url = `${baseUrl}?${queryParams.join('&')}`
fetch(url)
.then((res) => {
    if (res.ok) return res.json()
    throw res
})
.catch((res) => {
    console.error('e', res)
    return res
})
.then((res) => {
    fse.writeFileSync(
        path.join(DUMP_AGNOSTIC, `resp_${fileSelected}`),
        JSON.stringify(res, null, JSON_WHITE_SPACE)
    )
    fetch(recountUrl)
    console.log(`Insert ID: ${res.slice(-1).insertId}`)
})