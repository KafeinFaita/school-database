const express = require('express')
const { index_get, login_get, login_post, register_get, studentRecord_get } = require('../controllers/mainController') 

const router = express.Router()

router.get('/', index_get);
router.get('/register', register_get)
router.get('/login', login_get);
router.get('/student-record', studentRecord_get)
router.post('/login', login_post)

module.exports = router;