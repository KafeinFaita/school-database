const mongoose = require('mongoose')
const Schema = mongoose.Schema

const parentSchema = new Schema({
    parentsguardian: [{
        name: {
            type: String,
            required: true
        },
        occupation: {
            type: String,
            required: true
        },
        office: {
            type: String,
            required: true
        },
        contact: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    }],

    student: [{
        type: Schema.Types.ObjectId,
        ref: 'student-record',
        required: true
    }] 
})

module.exports = mongoose.model('parent', parentSchema)
