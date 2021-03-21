const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
    type: String,
    required: true
}

const inqSchema = new Schema({
    name: requiredString,
    contact: {
        type: Number,
        required: true
    },
    address: requiredString,
    inquiry: requiredString

})

module.exports = mongoose.model('inq', inqSchema)
