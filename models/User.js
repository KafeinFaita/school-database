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
    },
    roles: {
        type: Array,
        required: true,
        default: ["Admin"]
    }
})

 userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 10)
    next()
 })

 // static method to login user
 userSchema.statics.login = async function(username, password) {
     const user = await this.findOne({ username })
     if (user) {
        const auth = await bcrypt.compare(password, user.password)
        if (auth) return user
        throw Error('Incorrect password')
     }
     throw Error('Incorrect username')
 }

module.exports = mongoose.model('user', userSchema)