const openFirefox = require('../amazon-download/startSelenium')
const cleanUrl = require('../util/cleanUrl')
const openPage = require('../amazon-download/openPage')
/**
 * @param {IGrunt} grunt
 */
module.exports = function(grunt) {
    grunt.config.init({
        ...grunt.file.readJSON('grunt-scripts/globalConfig.json'),
        ...grunt.file.readJSON('grunt-scripts/amazon-download/config.json')
    })
    grunt.registerTask('amazon-download', function() {
        grunt.option('no-color', true)
        const done = this.async()
        const self = this
        const TASK = 'amazon-download'
        const url = grunt.option('src')
        if (!url) grunt.warn('Missing a url. Use the url flag ex: grunt amazon-download --src=123')
        return openFirefox()
        .then((driver) => {
            return openPage(driver, cleanUrl(url))
            .then(() => {
                return require('../amazon-download/findProduct')(driver)
            })
            .then((productTitle) => {
                const addToLog = require('../amazon-download/addToLog')
                const downloadPageSource= require('../amazon-download/downloadPageSource')
                return Promise.all([
                    addToLog(
                        cleanUrl(url), 
                        `${productTitle || url.replace(/\\/g, '-')}.html`,
                        grunt.config.get('dest')
                    ), downloadPageSource(
                        driver,
                        productTitle,
                        grunt.config.get('src')
                    )
                ])
                .then(driver.quit)
                .catch((err) => {
                    driver.quit()
                    grunt.warn(err)
                    return Promise.reject(err)
                })
            })
        })
        .then(done)
    })
}