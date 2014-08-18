var router = require('express').Router();
var faq = require('../controllers/api/faq');
var variable = require('../controllers/api/variable');

function isAdmin(req, res, next) {
  if (req.user && req.user.isAdmin())
    next();
  else
    res.send(401, 'NOT AUTHORIZED');
}

// FAQ API Routes
router.post('/faq', isAdmin, faq.create);
router.get('/faq/:id?', faq.read);
router.post('/faq/:id', isAdmin, faq.update);
router.delete('/faq/:id', isAdmin, faq.delete);

// Variable API Routes
router.post('/variable/:name', isAdmin,  variable.update);
router.get('/variable/:name', variable.read);

module.exports = router;
