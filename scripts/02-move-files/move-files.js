// move files to required locations.
// cover: copy to cover folder in dist
// .csv copy to mysql/uploads

require('colors')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const path = require('path')

// constants
const {
    dump, csvLocation, imgLocation,
} = require('./config.json')
const DUMP_AGNOSTIC = dump.split('\\')
const { NO_CHOICE_SELECTED, acceptableTypes } = require('./constants')
const { fileIsType, copyFileToLocations, imageHandler, csvHandler, addAsMeta } = require('./handlers/handler')

// ask for files of type
const files = fse.readdirSync(path.join(...DUMP_AGNOSTIC))
                    .filter((item) => {
                        for (let i = 0; i < acceptableTypes.length; i++) {
                            if (item.match(acceptableTypes[i]) !== null) return true
                        }
                        return false;
                    })
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
        if (fileIsType(selectedFile, [/\.jpg/, /\.jpg/, /\.png/, /\.gif/])) {
            // optionally: add cover to json
            addAsMeta(selectedFile, 'cover', imageHandler)
            copyFileToLocations(
                path.join(...DUMP_AGNOSTIC, selectedFile),
                imgLocation,
                selectedFile
            )
        }
        if (fileIsType(selectedFile, [/\.csv/])) {
            // optional ask to overwrite a key
            addAsMeta(selectedFile, 'csv filename', csvHandler)
            copyFileToLocations(
                path.join(...DUMP_AGNOSTIC, selectedFile),
                csvLocation,
                selectedFile
            )
        }
    }
    // end while
}