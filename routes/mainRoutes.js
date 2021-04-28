const express = require('express')
const { requireAuth, checkUser, checkRole } = require('../controllers/middleware')
const { 
    index_get, login_get, login_post, 
    register_post, register_get, 
    studentRecord_get, studentSubmit_get, errorPage_get,
    student_record_post, studentRecord_get_one, 
    studentRecord_put_one, studentRecord_delete_one,
    section_get, section_post, section_delete,
    teacher_get, record_api_get,
    parent_api_get, inquiry_get,
    inq_post, parents_get,
    parents_one_get, dashboard_get,
    parents_one_put, fee_assess_get,
    fee_assess_put, profile_get,
    logout_get } = require('../controllers/mainController') 

const router = express.Router()

router.get('*', checkUser)
router.get('/', index_get);
router.get('/dashboard', requireAuth, checkRole(['Admin', 'User']), dashboard_get)
router.get('/register', register_get)
router.get('/login', login_get)
router.get('/logout', logout_get)
router.get('/student-record', requireAuth, studentRecord_get)
router.get('/student-record/submit', requireAuth, studentSubmit_get)
router.get('/parents', requireAuth, parents_get)
router.get('/parents/:id', requireAuth, parents_one_get)
router.get('/student-record/:id', requireAuth, studentRecord_get_one)
router.get('/student-record/:id/fee-assess', requireAuth, fee_assess_get)
router.get('/section', requireAuth, section_get)
router.get('/teacher', requireAuth, teacher_get)
router.get('/inquiry', requireAuth, inquiry_get)
router.get('/api/student-record', checkRole(['Admin']), requireAuth, record_api_get)
router.get('/api/parent', requireAuth, checkRole(['Admin']), parent_api_get)
router.get('/profile', requireAuth, profile_get)
router.get('*', requireAuth, errorPage_get)

router.post('/register', register_post)
router.post( '/login', login_post)
router.post('/student-record', student_record_post)
router.post('/section', section_post)
router.post('/inquiry', inq_post)

router.put('/student-record/:id', studentRecord_put_one)
router.put('/parents/:id', parents_one_put)
router.put('/student-record/:id/fee-assess', fee_assess_put)

router.delete('/student-record/:id', studentRecord_delete_one)
router.delete('/section/:id', section_delete)

module.exports = router;