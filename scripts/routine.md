# Introduction
The following outlines a routine for gathering the required information to add a new book to the Koohi database:

# Process
1. Download the html file from amazon (record the source href manually)
2. Run amazon-extract and extract the info into a JSON
3. Run move-files, set filename meta, cover meta (optional)
4. Run modify book, add missing information
5. Run zip, archiving relevant files