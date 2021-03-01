const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
    department: {
        type: String,
        required: true
    },
    lrn: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        required: true
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'section',
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    birthplace: {
        type: String,
        required: true
    },
    middlename: {
        type: String,
        required: true
    },
    religion: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    nationality: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('student-record', recordSchema)