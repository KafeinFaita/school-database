const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
    type: String,
    required: true
}

const recordSchema = new Schema({
    department: {
        type: Schema.Types.ObjectId,
        ref: 'department',
        required: true
    },
    lrn: requiredString,
    grade: {
        type: Schema.Types.ObjectId,
        ref: 'grade',
        required: true
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section',
        required: true
    },
    lastname: requiredString,
    dob: requiredString,
    firstname: requiredString,
    birthplace: requiredString,
    middlename: requiredString,
    religion: requiredString,
    address: requiredString,
    nationality: requiredString,
    gender: requiredString,
    mobile: requiredString,
    email: requiredString,
})

module.exports = mongoose.model('student-record', recordSchema)

