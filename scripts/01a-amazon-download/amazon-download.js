require('colors')
const path = require('path')
const fse = require('fs-extra')
const readLineSync = require('readline-sync')
const args = process.argv.slice(2) // represents urls

const {
    geckodriverPath, dump
} = require('./config.json')
const DUMP_AGNOSTIC = path.join(...dump.split('\\'))

const cleanUrl = (url) => {
    // fragile solution
    const m = url.match(/(.*?)\/product\/(.*?)\//)[0]
    if (m === null) {
        console.log('Possibly invalid url format for ', url)
        process.exit(0)
    }
    return m
}

const doWork = async (driver, By, url) => {
    // 2. Take action
    const cleanedUrl = cleanUrl(url)
    await driver.get(cleanedUrl)

    // 3. Request browser information
    // 4. Waiting Strategy
    driver.manage().setTimeouts({implicit: 7}) // this is not a good strategy but works

    // 5. Find an Element
    productTitle = await driver.findElement(By.id('productTitle')).getText()
    await driver.getPageSource()
            .then(src => {
                fse.writeFileSync(
                    path.join(DUMP_AGNOSTIC, `${productTitle || url.replace(/\\/g, '-')}.html`),
                    src
                )
            })
            .catch(console.log)
    console.log(`Finished process ${cleanedUrl}`)
}

async function main(items) {
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
    for (let i = 0; i < items.length; i++) {
        await doWork(driver, By, items[i])
    }
    
    await driver.quit();
}

const usingInput = args.length > 0 ? args : [readLineSync.question("What is the url of the page you want to download")]
if (!usingInput) {
    console.log('No url provided. Aborting'.red)
    process.exit(0)
}
main(usingInput)
