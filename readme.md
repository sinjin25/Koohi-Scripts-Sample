# Intro
THIS IS A CODING SAMPLE
The following repository holds various scripts for handling tasks on a production website. They are meant to standardize trivial/routine tasks.
Each folder in /scripts/ holds the supporting files for a script that's the same name as the folder.

A script would be run like:
node scripts/01a-amazon-download/amazon-download.js

# Files
## Amazon-Extract
Download a full html webpage from Amazon, extractor will generate a JSON from scratch containing extracted data.
Use: Generate book JSON data from scratch.
## Zip
Takes raw files of your choosing and archives them.
Use: Archive files after you're finished with them so there's a record.
## Move-Files
Moves supporting files to the necessary locations.
Use: Move covers to cover folders, csv to mysql upload folder.
## Modify-Book
Modify a book's JSON data file with information that wasn't available from the Amazon extract.
Use: Add csv data file name, things like "readability" "info href"

# JSON Structure
Data pertaining to books are created from Amazon-Extract into a JSON file. Structure:
## Keys
- description: book description (Amazon)
- cover: cover image href or file (move-files/Amazon)
- author ([Obj])
    - author: author name (Amazon)
    - href: href to author's amazon page (Amazon)
- title_jp: title in Japanse (Amazon)
- title: title in Romaji (modify-book)
- medium: anime, book, etc. (modify-book)
- readability: score value (modify-book)
- permission: public (modify-book)
- filename: filename of csv (move-files/modify-book)