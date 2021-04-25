const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
// const { isEmail } = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minLength: [6, "Minimum password length is 6"]
    }
})

 userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
 })

module.exports = mongoose.model('user', userSchema)