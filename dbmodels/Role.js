var db = require('mongoose-simpledb').db;

exports.schema = {
  name: String,
  description: String
};

exports.methods = {
  // Get all users with the specific role.
  getUsers: function (cb) {
    // TODO: db query into user roles.
  }
};
