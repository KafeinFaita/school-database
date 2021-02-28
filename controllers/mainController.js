const User = require('../models/User')
const Section = require('../models/Section')
const StudentRecord = require('../models/StudentRecord')
const bcrypt = require('bcrypt')

//GET requests

module.exports.index_get = (req, res) => {
    res.redirect('/student-record')
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.register_get = (req, res) => {
    res.render('register')
}

module.exports.studentRecord_get = async (req, res) => {

    const sections = await Section.find();

    if (Object.keys(req.query).length !== 0) {

        const tempQuery = {};

        for (let x in req.query) {
            if (req.query[x] !== '') {
                tempQuery[x] = new RegExp(`^${req.query[x]}$`,'i')
            }
        }

        try {
            const searchName = await StudentRecord.find(tempQuery)
            res.render('student-record', { record: searchName, sections })
        } catch(err) {
            console.log(err)
        }
        
    } else {
        res.render('student-record', { sections, record: {} })
    }  
}

module.exports.studentRecord_get_one = async (req, res) => {
    
    try {
        const getStudent = await StudentRecord.findById(req.params.id)
        const sections = await Section.find()
     
        res.render('student-record-one', { student: getStudent, url: req.url, sections })
    } catch (err) {
        res.status(404).render('404')
    }
    
}

module.exports.section_get = async (req, res) => {
    
    try {
        const sections = await Section.find()
        res.render('section', { sections })
    } catch (err) {
        res.status(404).render('404')
    }
}

module.exports.errorPage_get = (req, res) => {
    
    res.status(404).render('404')
    
}

module.exports.teacher_get = (req, res) => {
    res.render('teacher')
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
    res.redirect('/student-record')
    
}

module.exports.section_post = async (req, res) => {   

    console.log(req.body)
    const section = new Section({ name: req.body.sectionName})

    try {
        const saveSection = await section.save()
        res.redirect('/section')
    } catch (error) {
        res.send('error')
    }
    
}

//PUT request

module.exports.studentRecord_put_one = async (req, res) => {

    try {
        const updateStudent = await StudentRecord.findByIdAndUpdate(req.params.id, req.body)
        console.log(req.params.id)
        res.send("success")
    } catch (err) {
        console.log(err)
    }
    
}

//DELETE request

module.exports.studentRecord_delete_one = async (req, res) => {

    try {
        const deleteStudent = await StudentRecord.findByIdAndDelete(req.params.id)
        res.send("deleted")
    } catch (err) {
        console.log(err)
    }
    
}

module.exports.section_delete = async (req, res) => {

    try {
        const deleteSection = await Section.findByIdAndDelete(req.params.id)
        res.redirect('/section')
    } catch (err) {
        console.log(err)
    }
    
}
