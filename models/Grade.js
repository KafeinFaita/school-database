const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gradeSchema = new Schema({
    title: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('grade', gradeSchema)
