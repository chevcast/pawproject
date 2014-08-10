var db = require('mongoose-simpledb').db;

exports.create = function (req, res) {
  var faq = new db.Faq({
    question: req.param('question'),
    answer: req.param('answer')
  });
  faq.save(function (err, faq) {
    if (err) return console.error(err);
    res.send(faq);
  });
};

exports.read = function (req, res) {
  db.Faq.find(function (err, faqs) {
    if (err) return console.error(err);
    res.send(faqs);
  });
};

exports.update = function (req, res) {
  var id = req.param('id');
  db.Faq.findByIdAndUpdate(id, {
    question: req.param('question'),
    answer: req.param('answer')
  }, function (err, faq) {
    if (err) return console.error(err);
    res.send(faq);
  });
};

exports.delete = function (req, res) {
  var id = req.param('id');
  db.Faq.findByIdAndRemove(id, function (err, faq) {
    if (err) return console.error(err);
    res.send({});
  });
};
