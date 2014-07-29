exports.blog = function (req, res) {
    res.render('root/blog', { title: 'Paw Project Blog' });
};

exports.faq = function (req, res) {
	res.render('root/faq', { title: 'Paw Project FAQ' });
};

exports.home = function (req, res) {
	res.render('root/home', { title: 'Paw Project' });
};
