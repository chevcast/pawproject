var router = require('express').Router();
var faq = require('../controllers/api/faq');
var variable = require('../controllers/api/variable');

// FAQ API Routes
router.post('/faq', faq.create);
router.get('/faq/:id?', faq.read);
router.post('/faq/:id', faq.update);
router.delete('/faq/:id', faq.delete);

// Variable API Routes
router.post('/variable/:name', variable.update);
router.get('/variable/:name', variable.read);

module.exports = router;
