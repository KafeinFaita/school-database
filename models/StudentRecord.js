const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
    type: String,
    required: true
}

const recordSchema = new Schema({
    department: [{
        sy: requiredString,
        data: {
            type: Schema.Types.ObjectId,
            ref: 'department',
            required: true
        }
    }],
    lrn: requiredString,
    grade: [{
        sy: requiredString,
        data: {
            type: Schema.Types.ObjectId,
            ref: 'grade',
            required: true
        }
    }],
    section: [{
        sy: requiredString,
        data: {
            type: Schema.Types.ObjectId,
            ref: 'section',
            required: true
        }
    }],
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
    syEnrolled: [ requiredString ],
    verified: {
        type: Boolean,
        default: false
    },
    fees: {
        books: {
            type: Number,
            default: 0
        },
        tuition: {
            type: Number,
            default: 0
        },
        misc: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    }
})

module.exports = mongoose.model('student-record', recordSchema) 

