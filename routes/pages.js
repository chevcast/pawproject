var router = require('express').Router();
var pages = require('../controllers/pages/root');

router.get('/', pages.home);
router.get('/blog', pages.blog);
router.get('/faq', pages.faq);

module.exports = router;
