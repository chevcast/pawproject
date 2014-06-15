var router = require('express').Router();

// Home
router.get('/', require('./home'));

// Main Blog
router.get('/blog', require('./blog'));

// FAQ
router.get('/faq', require('./faq'));

module.exports = router;
