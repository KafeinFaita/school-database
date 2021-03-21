const express = require('express')
const { 
    index_get, login_get, 
    login_post, register_get, 
    studentRecord_get, studentSubmit_get, errorPage_get,
    student_record_post, studentRecord_get_one, 
    studentRecord_put_one, studentRecord_delete_one,
    section_get, section_post, section_delete,
    teacher_get, record_api_get,
    parent_api_get, inquiry_get,
    inq_post } = require('../controllers/mainController') 

const router = express.Router()

router.get('/', index_get);
router.get('/register', register_get)
router.get('/login', login_get);
router.get('/student-record', studentRecord_get)
router.get('/student-record/submit', studentSubmit_get)
router.get('/student-record/:id', studentRecord_get_one)
router.get('/section', section_get)
router.get('/teacher', teacher_get)
router.get('/inquiry', inquiry_get)
router.get('/api/student-record', record_api_get)
router.get('/api/parent', parent_api_get)
router.get('*', errorPage_get)

router.post('/login', login_post)
router.post('/student-record', student_record_post)
router.post('/section', section_post)
router.post('/inquiry', inq_post)

router.put('/student-record/:id', studentRecord_put_one)

router.delete('/student-record/:id', studentRecord_delete_one)
router.delete('/section/:id', section_delete)

module.exports = router;