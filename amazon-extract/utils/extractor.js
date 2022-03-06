const extract = require('./extract.js')

const extractDescription = (root, obj) => {
    const description = extract(root, '#bookDescription_feature_div .a-expander-content')
    if (description) {
        obj.description = description.textContent.trim()
    }
}

const extractCover = (root, finalObj) => {
    const cover = extract(root, '#imageBlockNew_feature_div .frontImage')
    if (cover) {
        const c = cover.getAttribute('data-a-dynamic-image')
        if (c) {
            const obj = JSON.parse(c)
            const keys = Object.keys(obj)
            let largest = null
            keys.forEach(i => {
                if (obj[i][0] > largest) largest = i
            })
            finalObj.cover = largest
        }
    }
}

const extractVolume = (root, finalObj) => {
    const series = extract(root, '#seriesBulletWidget_feature_div a')
    if (series) {
        const s = series.textContent.trim()
        // get series
        const sText = s.match(/\:(.*?)$/)
        if (sText) {
            finalObj.series = sText[0]
                            .replace(/(.*?) /, '')
                            .replace(/。(.*?)$/, '')
        }
        // get current volume
        const cText = s.split(' of ')
        if (cText.length > 0) finalObj.volume = cText[0].replace(/[A-Za-z]/g, '').trim()
    }
}

const extractAuthor = (root, finalObj) => {
    const author = root.querySelectorAll('#bylineInfo .contributorNameID')
    if (author.length > 0) {
        finalObj.author = []
        for(let i = 0; i < author.length; i++) {
            finalObj.author.push({
                author: author[i].textContent,
                href: author[i].getAttribute('href')
            })
        }
    }
}

const extractTitle = (root, finalObj) => {
    const title = root.querySelector('#productTitle').textContent
    finalObj.title_jp = title.replace(/（(.*?)$/, '').trim()
}

function routine(root, finalObj) {
    this.description(root, finalObj)
    this.cover(root, finalObj)
    this.volume(root, finalObj)
    this.author(root, finalObj)
}

module.exports = {
    description: extractDescription,
    cover: extractCover,
    volume: extractVolume,
    author: extractAuthor,
    title: extractTitle,
    routine,
}