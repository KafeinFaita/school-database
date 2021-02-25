const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gradeSchema = new Schema({
    name: {
        type: String
    },
    grade: {
        type: Number
    }
})

module.exports = mongoose.model('grade', gradeSchema)
