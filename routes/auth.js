const express = require('express');
const router = express.Router();

const auth = require('../controllers/auth');

router.post('/signup', auth.postSignup);


module.exports = router;