const Grade = require('../models/Grade')

module.exports.index_get = (req, res) => {
    res.render('index');
}

module.exports.index_post = async (req, res) => {
    const grade = new Grade(req.body)
    
    try{
        const saveGrade = await grade.save()
        res.json(req.body)
    }
    catch(err) {
        res.send(err)
    }
}

module.exports.login_get = (req, res) => {
    res.render('login')
}