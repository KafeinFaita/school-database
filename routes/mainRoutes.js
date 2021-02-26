const express = require('express')
const { index_get, login_get, login_post, register_get, studentRecord_get, student_record_post, studentRecord_get_one } = require('../controllers/mainController') 

const router = express.Router()

router.get('/', index_get);
router.get('/register', register_get)
router.get('/login', login_get);
router.get('/student-record', studentRecord_get)
router.get('/student-record/:id', studentRecord_get_one)

router.post('/login', login_post)
router.post('/student-record', student_record_post)

module.exports = router;