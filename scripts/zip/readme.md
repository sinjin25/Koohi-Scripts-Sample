# Introduction
Use to create an archive of files relating to a piece of media (cover, text, word list, etc.) and archive it according to category

# Files
## config.example.json
### dump
File location to the where the relevant files to archive are contained
### destination
Where you're going to shove the files. Should be a folder, the folder will probably end up having five folders in it: Books, Anime, Games, Other, Drama
## constants.js
Constant strings such as warning messages
## zip.js
The main file. Takes several inputs. Optional flag -name used for quickly determining the archive name