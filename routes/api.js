var router = require('express').Router();
var faq = require('../controllers/api/faq');

// FAQ API Routes
router.post('/faq', faq.create);
router.get('/faq/:id?', faq.read);
router.put('/faq/:id', faq.update);
router.delete('/faq/:id', faq.delete);

module.exports = router;
