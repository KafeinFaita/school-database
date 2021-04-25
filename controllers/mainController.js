const User = require('../models/User')
const Section = require('../models/Section')
const Dept = require('../models/Department')
const StudentRecord = require('../models/StudentRecord')
const Grade = require('../models/Grade')
const Parent = require('../models/ParentGuardian')
const Inq = require('../models/Inq')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Department = require('../models/Department')

// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { username: '', password: ''}

    if (err.message === 'Incorrect username') {
        errors.username = 'That username is not registered'
    }

    if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password'
    }

    // duplicate error code
    if (err.code === 11000) {
        errors.username = "Username is already registered."
        return errors
    }

    // validation errors
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })        
    }
    return errors
}

//create token

const maxAge = 3 * 24 * 60 * 60
const createToken = id => {
    return jwt.sign({ id }, 'schooldb secret', {
        expiresIn: maxAge
    })
}

//GET requests

module.exports.index_get = (req, res) => {
    res.redirect('/dashboard')
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
    const record = await StudentRecord.find().populate('section.data grade.data department.data').exec()
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
        const getStudent = await StudentRecord.findById(req.params.id).populate('section.data grade.data department.data').exec()
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

module.exports.parents_one_get = async (req, res) => {
    try {
        const parent = await Parent.findById(req.params.id)
        res.render('parents-one', { parents: parent.parentsguardian, url: req.url })
    } catch (error) {
        res.send(error)
    }
}

module.exports.fee_assess_get = async (req, res) => {

    try {
        const student = await StudentRecord.findById(req.params.id)
        res.render('fee-assess', { books: student.fees.books, tuition: student.fees.tuition, misc: student.fees.misc, url: req.url })
    } catch (error) {
        res.render('404')
    }
    
}

module.exports.profile_get = (req, res) => {
    res.render('profile')
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



// POST requests

module.exports.register_post = async (req, res) => {   
    const { username, password } = req.body
    
    try {
        const saveUser = await User.create({ username, password })
        const token = createToken(saveUser._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json( { user: saveUser._id } )
    }
    catch(err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
}

module.exports.login_post = async (req, res ) => {
    const { username, password } = req.body
    
    try {
        const user = await User.login(username, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    } catch (err) {
        const errors = handleErrors(err)
        console.log(errors)
        res.status(400).json({ errors })
    }
}

module.exports.student_record_post = async (req, res) => {
    
    const record = new StudentRecord({
        department: [{
            sy: req.body.sy,
            data: req.body.department
        }],
        grade: [{
            sy: req.body.sy,
            data: req.body.grade
        }],
        section: [{
            sy: req.body.sy,
            data: req.body.section
        }],
        lrn: req.body.lrn,
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
        email: req.body.email,
        syEnrolled: [ req.body.sy ]
    })

    
    try{
        const saveRecord = await record.save(async (err, res) => {
            if (err) {
                console.log(err)
            } else {
                const guardian = [{
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
                    }]
    
                

                if (req.body.parentsyn === "yes") {
                    const parent = new Parent({ parentsguardian: guardian, student: [record._id] })
                    const saveParent = await parent.save()
                } else if (req.body.parentsyn === "no") {
                    console.log(req.body.parentid)
                    try {
                        const parent = await Parent.findById(req.body.parentid)
                        const updateParent = await Parent.findByIdAndUpdate(req.body.parentid, { student: [...parent.student, record._id] })
                    } catch (error) {
                        console.log(error)
                    }
                    
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

// PUT&PATCH request

module.exports.studentRecord_put_one = async (req, res) => {

    try {

        const getStudent = await StudentRecord.findById(req.params.id).populate('section.data grade.data department.data').exec()

        const addData = (existingData, bodyData) => getStudent.syEnrolled.includes(req.body.sy) ? existingData : [ ...existingData, { sy: req.body.sy, data: bodyData } ]

        const newData = {
            department: addData(getStudent.department, req.body.department),
            grade: addData(getStudent.grade, req.body.grade),
            section: addData(getStudent.section, req.body.section),
            lrn: req.body.lrn,
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
            email: req.body.email,
            syEnrolled: getStudent.syEnrolled.includes(req.body.sy) ? getStudent.syEnrolled : [ ...getStudent.syEnrolled, req.body.sy ],
            verified: req.body.verified ?  true : false
        }
        const updateStudent = await StudentRecord.findByIdAndUpdate(req.params.id, newData)
        res.redirect('/')
    } catch (err) {
        console.log(err)
    }
    
}

module.exports.parents_one_put = async (req, res) => {
    
    const parentsGuardian = {
        parentsguardian: [
            {
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
            }
        ]
    }
    
    try {
        const updateParent = await Parent.findByIdAndUpdate(req.params.id, parentsGuardian)
        res.redirect('/parents')
    } catch (error) {
        res.send(error)
    }
}

module.exports.fee_assess_put = async (req, res) => {

    try {
        const student = await StudentRecord.findByIdAndUpdate(req.params.id, {
            fees: req.body
        })
        res.redirect(`/student-record/${req.params.id}`)
    } catch (error) {
        res.send(error)
    }
    
}

//DELETE request

module.exports.studentRecord_delete_one = async (req, res) => {

    try {
        const deleteStudent = await StudentRecord.findByIdAndDelete(req.params.id)
        res.redirect('/student-record')
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
