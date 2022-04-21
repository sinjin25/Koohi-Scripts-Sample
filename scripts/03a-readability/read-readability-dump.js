require('colors')
const fse = require('fs-extra')
const path = require('path')

const config = require('../02-move-files/config.json')
const { dump, JSONdump } = config

const PATTERN = / read.txt$/

function readDump() {
    const files = fse.readdirSync(dump, {encoding: 'utf-8'}).filter(i => i.match(PATTERN))
    // read each file
    const calls = []
    files.forEach((i) => {
        const aCall = fse.readFile((path.join(dump, i)), 'utf8')
        .then((data) => {
            return data
        })
        calls.push(aCall)
    })
    return Promise.allSettled(calls)
}

module.exports = readDump