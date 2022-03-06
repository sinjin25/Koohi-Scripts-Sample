// require
require('colors')
const archiver = require('archiver')
const path = require('path')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const args = require('minimist')(process.argv.slice(2))

// constants
const { destination, dump } = require('./config.json')
const { ZLIB_BEST_COMPRESSION, NO_CHOICE_SELECTED, BOOK_TYPES, WARNINGS } = require('./constants.js')
const DESTINATION_AGNOSTIC = destination.split('\\') // work on multiple OS

// INPUT: Book type
const categoryIndex = readLineSync.keyInSelect(BOOK_TYPES, 'What category should the archive be in?\n')
if (categoryIndex === NO_CHOICE_SELECTED || !BOOK_TYPES[categoryIndex]) {
    console.log(`${WARNINGS.MISSING_INPUT_CATEGORY}`.red)
    process.exit(0)
}
const categoryFolder = BOOK_TYPES[categoryIndex]

// INPUT: Archive name
let archiveName = args.name || readLineSync.question('What do you want to name the archive?\n')
if (!archiveName) {
    console.log(`${WARNINGS.MISSING_INPUT_ARCHIVE}`.red)
    process.exit(0)
}
// check for zip file
if (fse.existsSync(
    path.join(...DESTINATION_AGNOSTIC, categoryFolder, `${archiveName}.zip`)
)) {
    console.log(`${WARNINGS.DUPLICATE_ARCHIVE_FILE}`.red)
    process.exit(0)
}

// add files here
const files = fse.readdirSync(path.join(...dump.split('\\')))
let selectedFiles = []
let fileIndex = null
while (fileIndex !== NO_CHOICE_SELECTED) {
    fileIndex = readLineSync.keyInSelect(files, 'Select a file to add to the archive\n')
    if (fileIndex !== NO_CHOICE_SELECTED) {
        selectedFiles.push(files[fileIndex])
        console.log(`Selected for archive:`.blue, selectedFiles)
    }
}
selectedFiles = Array.from(new Set(selectedFiles))

// Proceed
if (selectedFiles.length === 0 || !readLineSync.keyInYN('Do you wish to proceed with the archive?\n')) {
    console.log(`${WARNINGS.REQUESTED_ABORT}`.red)
    process.exit(0)
}

// WRITE SHIT HERE
fse.ensureDir(path.join(...DESTINATION_AGNOSTIC, categoryFolder))
fse.ensureDirSync(path.join(...DESTINATION_AGNOSTIC, categoryFolder, archiveName))

// setup write stream
const zipPath = path.join(
    ...DESTINATION_AGNOSTIC, categoryFolder, archiveName, `${archiveName}.zip`
)
const output = fse.createWriteStream(zipPath)
output.on('close', () => {
    console.log(`Archived ${categoryFolder} ${archiveName}`)
    console.log(`Total bytes in zip: ${archive.pointer()}`)
    console.log(`Archiving is now finished`)
})

// setup archive and connect to write stream
const archive = archiver('zip', {
    zlib: { level: ZLIB_BEST_COMPRESSION }
})
archive.on('error', err => {
    throw err;
})
archive.pipe(output) // pipe shit into the write stream

// get files from dump, append to archive
selectedFiles.forEach(fileName => {
    archive.append(fse.createReadStream(
        path.join(...dump.split('\\'), fileName)
    ), { name: fileName })
})

archive.finalize()