# Intro
Move files raw files to required locations. Some of these may be to within an app (for asset building), some may be to backup locations, etc.
# Files
## config.json
dump: Where to look for files
csvLocation: array of places to copy the selected file over to if the selected file is a .csv
imgLocation: array of places to copy the selected file over to if the selected file is an image
JSONdump: where to look for json files to modify
## constants.js
Constants
## handlers/handler.js
Handles the logic for moving items to folders, handling specific tasks (ex: image handler offering the option to overwrite a book's JSON file's cover key)
## move-files.js
Main
