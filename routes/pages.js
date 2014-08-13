var router = require('express').Router();
var pages = require('../controllers/pages/root');

router.get('/', pages.home);
router.get('/blog', pages.blog);
router.get('/faq', pages.faq);
router.get('/about', pages.about);
router.get('/login', pages.login);

module.exports = router;
