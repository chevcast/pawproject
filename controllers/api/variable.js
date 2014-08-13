var db = require('mongoose-simpledb').db;

exports.read = function (req, res) {
  db.Variable.findOne({ name: req.param('name') }, function (err, variable) {
    if (err) return console.error(err);
    if (!variable)
      variable = { name: req.param('name') };
    res.send(variable);
  });
};

exports.update = function (req, res) {
  db.Variable.findOneAndUpdate(
    { name: req.param('name') },
    { value: req.param('value') },
    { upsert: true },
    function (err, variable) {
      if (err) return console.error(err);
      res.send(variable);
    }
  );
};
