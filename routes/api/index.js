var router = require('express').Router();

// FAQ API Routes
router.post('/faq', require('./faq/create'));
router.get('/faq/:id?', require('./faq/read'));
router.put('/faq/:id', require('./faq/update'));
router.delete('/faq/:id', require('./faq/delete'));

module.exports = router;
