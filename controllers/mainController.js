const User = require('../models/User')
const StudentRecord = require('../models/StudentRecord')
const bcrypt = require('bcrypt')

//GET requests

module.exports.index_get = (req, res) => {
    res.render('index');
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.register_get = (req, res) => {
    res.render('register')
}

module.exports.studentRecord_get = async (req, res) => {

    if (Object.keys(req.query) !== 0) {
        try {
            const searchName = await StudentRecord.find({ firstname: new RegExp(`^${req.query.name}$`,'i')})
            res.render('student-record', { record: searchName })
        } catch(err) {
            console.log(err)
        }
        
    } else {
        console.log(req.query)
        res.render('student-record')
    }  
}

module.exports.studentRecord_get_one = async (req, res) => {
    
    try {
        const getStudent = await StudentRecord.findById(req.params.id)
        console.log(getStudent)
        res.render('student-record-one', { student: getStudent })
    } catch (err) {
        console.log(err)
    }
    
}


//POST requests

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

module.exports.student_record_post = async (req, res) => {   
    const record = new StudentRecord(req.body)

    const saveRecord = await record.save()
    res.json(record)
    
}

