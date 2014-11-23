exports.blog = function (req, res) {
  res.render('root/blog', { title: 'Paw Project Blog' });
};

exports.about = function (req, res) {
  res.render('root/static', {
    title: 'About The Paw Project',
    resourceName: 'aboutContent'
  });
};

exports.contribute = function (req, res) {
  res.render('root/static', {
    title: 'Contribute',
    resourceName: 'contributeContent'
  });
};

exports.mailingList = function (req, res) {
  res.render('root/static', {
    title: 'Join Our Mailing List',
    resourceName: 'mailingListContent'
  });
};

exports.whatYouCanDo = function (req, res) {
  res.render('root/static', {
    title: 'What You Can Do To Help',
    resourceName: 'whatYouCanDoContent'
  });
};

exports.team = function (req, res) {
  res.render('root/static', {
    title: 'The Paw Project Team',
    resourceName: 'teamContent'
  });
};

exports.legislation = function (req, res) {
  res.redirect('http://www1.pawproject.org/legislation/');
  /*
   *res.render('root/static', {
   *  title: 'Legislation',
   *  resourceName: 'legislationContent'
   *});
   */
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
