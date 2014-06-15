var router = require('express').Router();

// Home
router.get('/', require('./home'));

// Main Blog
router.get('/blog', require('./blog'));

module.exports = router;
