var express = require('express');
var auth = require('./auth');
var router = express.Router();

router.post('/api/v1/register', auth.registration);
router.post('/api/v1/login', auth.login);
router.post('/api/v1/registerStudent', auth.registerStudent);
router.post('/api/v1/registerTeacher', auth.registerTeacher);

module.exports = router;