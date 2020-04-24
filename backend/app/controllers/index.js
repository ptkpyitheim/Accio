const express = require('express');
const router = express.Router();

router.use('/email', require('./email'));


router.use('/signup', require('./signup'));
router.use('/authtoken', require('./authtoken'));
router.use('/allgroups', require('./allgroups'));
router.use('/requestpasswordreset', require('./requestpasswordreset'));

router.use('/authed', require('./authed'));

module.exports = router;
