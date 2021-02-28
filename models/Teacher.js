const mongoose = require('mongoose')
const Schema = mongoose.Schema

const requiredString = {
    type: String,
    required: true
}

const teacherSchema = new Schema({
    lastName: requiredString,
    firstName: requiredString,
    middleName: requiredString,
    dob: requiredString,
    gender: requiredString,
    address: requiredString,
    email: requiredString,
    contact: {
        type: Number,
        required: true
    },
    religion: requiredString,
    joinDate: requiredString

})

module.exports = mongoose.model('teacher', teacherSchema)