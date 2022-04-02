// npm i
// run: npm run test
const chai = require('chai')
const expect = chai.expect
const definitionTransform = require('../operations/util/definitionTransform.js')
console.log('def', definitionTransform)
describe("testing the definition transformer", function() {
    it("should handle 化ける", function() {
        const definitions = [
            'to take the form of (esp. in ref. to a spirit, fox, raccoon dog, etc.),to assume the shape of,to turn oneself into,to transform oneself into',
            `to disguise oneself as`,
            `to change radically,to metamorphose`,
            `to improve unexpectedly and dramatically (esp. of an actor, artist, rikishi, etc.)`,
            `to age,to grow old (esp. in appearance),to show marks of age`,
        ]
        expect(definitionTransform(definitions[0])).to.eql([
            'to take the form of',
            'to assume the shape of',
            'to turn oneself into',
            'to transform oneself into',
        ])
        expect(definitionTransform(definitions[1])).to.eql([
            `to disguise oneself as`
        ])
        expect(definitionTransform(definitions[3])).to.eql([
            `to improve unexpectedly and dramatically`
        ])
        expect(definitionTransform(definitions[4])).to.eql([
            `to age`,
            `to grow old`,
            `to show marks of age`,
        ])
    })
})