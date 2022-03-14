const img = [/\.jpg/, /\.jpeg/]
const csv = [/\.csv/]
const acceptableTypes = [...img, ...csv]
module.exports = {
    img,
    csv,
    acceptableTypes,
    NO_CHOICE_SELECTED: -1,
}