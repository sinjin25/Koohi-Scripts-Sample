// move files to required locations.
// cover: copy to cover folder in dist
// .csv copy to mysql/uploads

require('colors')
const { readdirSync } = require('fs-extra')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const path = require('path')

// constants
const {
    dump, csvLocation, imgLocation
} = require('./config.json')
const DUMP_AGNOSTIC = dump.split('\\')
const { NO_CHOICE_SELECTED } = require('./constants')

// ask for file
const files = fse.readdirSync(path.join(...DUMP_AGNOSTIC))
if (files.length === 0) {
    console.log("No files found in folder".red, path.join(...DUMP_AGNOSTIC))
    process.exit(0)
}
let fileIndex = null
while (fileIndex !== NO_CHOICE_SELECTED) {
    fileIndex = readLineSync.keyInSelect(files, 'Select a file\n')
    if (fileIndex !== NO_CHOICE_SELECTED) {
        const selectedFile = files[fileIndex]
        let matched = null
        // img test
        if (
            selectedFile.match(/\.jpeg/) !== null
            || selectedFile.match(/\.jpg/) !== null
            || selectedFile.match(/\.png/) !== null
            || selectedFile.match(/\.gif/) !== null
        ) {
            matched = true
            // copy to image folders
            imgLocation.forEach(loc => {
                try {
                    fse.copySync(
                        path.join(...DUMP_AGNOSTIC, selectedFile),
                        path.join(...loc.split('\\'), selectedFile)
                    )
                } catch (err) {
                    console.error(err)
                }
            })
            continue; // end early
        }
        if (selectedFile.match(/\.csv/) !== null) {
            matched = true
            // copy to upload folder
            csvLocation.forEach(loc => {
                try {
                    fse.copySync(
                        path.join(...DUMP_AGNOSTIC, selectedFile),
                        path.join(...loc.split('\\'), selectedFile)
                    )
                } catch (err) {
                    console.error(err)
                }
            })
            continue // end early
        }
    }
    // end while
}