const express = require('express');
const router = express.Router();

router.use('/verifyemail', require('./verifyEmail'));
router.use('/passwordreset', require('./passwordreset'));


module.exports = router;
