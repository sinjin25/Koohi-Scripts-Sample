const fs = require('fs');
const client = require('https');

function downloadImage(url, filepath) {
    console.log('downloadImage received', url, filepath)
    return new Promise((resolve, reject) => {
        client.get(url, (res) => {
            if (res.statusCode === 200) {
                res.pipe(fs.createWriteStream(filepath))
                    .on('error', reject)
                    .once('close', () => resolve(filepath));
            } else {
                // Consume response data to free up memory
                res.resume();
                reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));

            }
        });
    });
}

module.exports = downloadImage
// example
/* downloadImage(
    'someurl',
    "C:\\Users\\Sinj\\Downloads\\release 5-14\\cover.jpg"
) */