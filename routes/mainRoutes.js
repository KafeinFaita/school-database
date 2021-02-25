const express = require('express')
const { index_get, index_post } = require('../controllers/mainController') 

const router = express.Router()

router.get('/', index_get);
router.post('/', index_post)

module.exports = router;