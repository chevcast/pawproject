var router = require('express').Router();

// Home
router.get('/', require('./home'));

// Main Blog
router.get('/blog', require('./blog'));

// FAQ
var faqHandlers = require('./faq');
router.get('/faq', faqHandlers.index);
// TODO: Figure out how ngResource works in detail and craft the following routes to adhere to their paradigm.
/*
 *router.get('/faq/getAll', faqHandlers.getAll);
 *router.post('/faq/addNew', faqHandlers.addNew);
 *router.post('/faq/update', faqHandlers.update);
 *router.post('/faq/delete', faqHandlers.delete);
 */

module.exports = router;
