require('colors')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const path = require('path')
const fetch = require('node-fetch')

const {
    FIELDS, JSON_MAP
} = require('./constants.js')
const {
    dump, baseUrl, pass, JSON_WHITE_SPACE
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

// get the bookId
const bookId = readLineSync.question('What is the bookId?')
if (!bookId) {
    console.log("No bookId inserted. Aborting.".red)
    process.exit(0)
}
const queryParams = [`pass=${pass}`, `bookId=${bookId}`]

// submit a preview
const contents = require(path.join(DUMP_AGNOSTIC, fileSelected))
FIELDS.forEach(i => {
    const propName = JSON_MAP[i]
    if (contents[propName]) {
        console.log(`${i}: ${contents[propName]}`)
        queryParams.push(`${i}=${contents[propName]}`)
    }
})

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
    console.log(`inserted rows: ${res.items}`)
})