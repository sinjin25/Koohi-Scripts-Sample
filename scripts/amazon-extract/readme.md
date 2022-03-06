# Introduction
Extract information from Amazon webpages. The final result will be a .json file
1. Open up an amazon page, right click save as complete web page (.htm)
2. Put into the dump folder (see config.example.json)
3. Run amazon-extract.js, follow options

# Files
## config.example.json
### destination
Where you're going to put the final .json files
### dump
Where the input is going to check for files to extract from
## utils
### extract.js
Function that will do a basic documentQuery on a HTMLParser text block
### extractor.js
Series of exports that contain instructions for extracting pieces of information from the HTMLParser text block
## amazon-extract.js
Allows you to select files from a folder to extract information from. Outputs .json files in the destination folder (see config.example.json)