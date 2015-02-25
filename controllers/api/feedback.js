var db = require('mongoose-simpledb').db;

exports.report = function (req, res) {
  var feedbackReport = new db.FeedbackReport({
    name: req.param('name'),
    email: req.param('email'),
    description: req.param('description')
  });
  feedbackReport.save(function (err, report) {
    if (err) return console.error(err);
    res.send(report);
  });
};
