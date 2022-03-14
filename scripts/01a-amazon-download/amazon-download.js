require('colors')
const path = require('path')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const args = process.argv.slice(2)
const [filename] = args

const {
    geckodriverPath, dump
} = require('./config.json')
const DUMP_AGNOSTIC = path.join(...dump.split('\\'))

async function main(url) {
    const { Builder, By } = require("selenium-webdriver");
    const firefox = require('selenium-webdriver/firefox');

    let options = new firefox.Options();
    const service = new firefox.ServiceBuilder(geckodriverPath);

    // 1. Start the session
    const driver = new Builder()
                    .forBrowser('firefox')
                    .setFirefoxService(service)
                    .setFirefoxOptions(options)
                    .build();

    // 2. Take action
    await driver.get(url)

    // 3. Request browser information
    // 4. Waiting Strategy
    driver.manage().setTimeouts({implicit: 7}) // this is not a good strategy but works

    // 5. Find an Element
    productTitle = await driver.findElement(By.id('productTitle')).getText()
    await driver.getPageSource()
            .then(src => {
                fse.writeFileSync(
                    path.join(DUMP_AGNOSTIC, `${productTitle || 'seleniumOutput'}.html`),
                    src
                )
            })
            .catch(console.log)

    await driver.quit();
    console.log('Finished process using url', url)
}

const usingInput = filename ? filename : readLineSync.question("What is the url of the page you want to download")
if (!usingInput) {
    console.log('No url provided. Aborting'.red)
    process.exit(0)
}
main(usingInput)
