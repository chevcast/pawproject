exports.blog = function (req, res) {
  res.render('root/blog', { title: 'Paw Project Blog' });
};

exports.about = function (req, res) {
  res.render('root/about', { title: 'About Paw Project' });
};

exports.faq = function (req, res) {
	res.render('root/faq', { title: 'Paw Project FAQ' });
};

exports.home = function (req, res) {
	res.render('root/home', { title: 'Paw Project' });
};

exports.contact = function (req, res) {
  res.render('root/contact', { title: 'Contact' });
};
