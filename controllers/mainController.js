const User = require('../models/User')
const Section = require('../models/Section')
const Dept = require('../models/Department')
const StudentRecord = require('../models/StudentRecord')
const Grade = require('../models/Grade')
const Parent = require('../models/ParentGuardian')
const Inq = require('../models/Inq')

const bcrypt = require('bcrypt')
const Department = require('../models/Department')

//GET requests

module.exports.index_get = (req, res) => {
    res.redirect('/student-record')
}

module.exports.dashboard_get = async (req, res) => {

    try {
        const students = await StudentRecord.find()
        const parents = await Parent.find()
        const sections = await Section.find()

        res.render('dashboard', { studentsNum: students.length, parentsNum: parents.length, sectionsNum: sections.length  })
    } catch (error) {
        res.send(error)
    }
    
}

module.exports.login_get = (req, res) => {
    res.render('login')
}

module.exports.register_get = (req, res) => {
    res.render('register')
}

module.exports.studentRecord_get = async (req, res) => {
    const record = await StudentRecord.find().populate('section grade department').exec()
    res.render('student-record', { record })
}

module.exports.studentSubmit_get = async (req, res) => {

    try {
        const sections = await Section.find()
        const grades = await Grade.find()
        const depts = await Dept.find()

        if (Object.keys(req.query).length !== 0) {

            const tempQuery = {};

            for (let x in req.query) {
                if (req.query[x] !== '') {
                    tempQuery[x] = new RegExp(`^${req.query[x]}$`,'i')
                }
            }

            try {
                const searchName = await StudentRecord.find(tempQuery)
                res.render('student-record', { record: searchName, sections, grades, depts })
            } catch(err) {
                console.log(err)
            }
            
        } else {
            res.render('student-submit', { sections, record: {}, grades, depts })
        }
    } catch (error) {
        res.send(error)
}  
}

module.exports.studentRecord_get_one = async (req, res) => {
    
    try {
        const getStudent = await StudentRecord.findById(req.params.id).populate('section grade department').exec()
        const sections = await Section.find()
        const grades = await Grade.find()
        const depts = await Dept.find()
      
        res.render('student-record-one', { student: getStudent, url: req.url, sections, grades, depts })
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

module.exports.inquiry_get = (req, res) => {
    res.render('inquiry')
}

module.exports.parents_get = async (req, res) => {

    const parent = await Parent.find().populate('student').exec()

    const studentNames = parent.map(par => {
        const names = par.student.map(stud => `${stud.firstname} ${stud.lastname}`)
        return names
    })

    const parentNames = parent.map(par => {
        const names = par.parentsguardian.map(pg => pg.name)
        return names
    })

    const idNum = parent.map(par => par._id)

    res.render('parents', { studentNames, parentNames, idNum })
}

module.exports.errorPage_get = (req, res) => {
    
    res.status(404).render('404')
    
}

module.exports.teacher_get = (req, res) => {
    res.render('teacher')
}

module.exports.record_api_get = async (req,res) => {
    const record = await StudentRecord.find().populate('department grade section').exec()
    res.json(record)
}

module.exports.parent_api_get = async (req, res) => {
    const parent = await Parent.find().populate('student').exec()
    res.json(parent)
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
    
    const record = new StudentRecord({
        department: req.body.department,
        lrn: req.body.lrn,
        grade: req.body.grade,
        section: req.body.section,
        lastname: req.body.lastname,
        dob: req.body.dob,
        firstname: req.body.firstname,
        birthplace: req.body.birthplace,
        middlename: req.body.middlename,
        religion: req.body.religion,
        address: req.body.address,
        nationality: req.body.nationality,
        gender: req.body.gender,
        mobile: req.body.mobile,
        email: req.body.email
    })

    console.log(req.body.siblingyn)
    
    try{
        const saveRecord = await record.save(async (err, res) => {
            if (err) {
                console.log(err)
            } else {
                if (req.body.parentsyn === "yes") {
                    const parent = new Parent({
                        parentsguardian: [{
                            name: req.body.mothername,
                            occupation: req.body.motheroccupation,
                            office: req.body.motheroffice,
                            contact: req.body.mothercontact,
                            email: req.body.motheremail
                        },
                        {
                            name: req.body.fathername,
                            occupation: req.body.fatheroccupation,
                            office: req.body.fatheroffice,
                            contact: req.body.fathercontact,
                            email: req.body.fatheremail
                        },
                        {
                            name: req.body.guardian,
                            occupation: req.body.guardianoccupation,
                            office: req.body.guardianoffice,
                            contact: req.body.guardiancontact,
                            email: req.body.guardianemail
                        }],
                        student: [record._id]
                    })
                    const saveParent = await parent.save()
                }
                
            }
        })
        
    } catch (err) {
        res.send('Record submit failed. Please contact admin')
    }
    
    res.redirect('/student-record')
    
}

module.exports.section_post = async (req, res) => {   

    const section = new Section({ name: req.body.sectionName})

    try {
        const saveSection = await section.save()
        res.redirect('/section')
    } catch (error) {
        res.send('error')
    }
    
}

module.exports.inq_post = async (req, res) => {

    const inquiry = new Inq(req.body)

    try {
        const saveInq = await inquiry.save()
        res.redirect('/')
    } catch (error) {
        res.send('error')
    }
}

//PUT request

module.exports.studentRecord_put_one = async (req, res) => {

    try {
        console.log(req.body)
        const updateStudent = await StudentRecord.findByIdAndUpdate(req.params.id, req.body)
        console.log(req.params.id)
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
    
}

//DELETE request

module.exports.studentRecord_delete_one = async (req, res) => {

    try {
        const deleteStudent = await StudentRecord.findByIdAndDelete(req.params.id)
        res.redirect('/')
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
