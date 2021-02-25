const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports.index_get = (req, res) => {
    res.render('index');
}

module.exports.login_post = async (req, res) => {   
    try {
        const hashedPass = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPass)
        const user = new User({ username: req.body.username, password: hashedPass })

        const saveGrade = await user.save()
        res.send(req.body)
    }
    catch(err) {
        res.send(err)
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.register_get = (req, res) => {
    res.render('register')
}