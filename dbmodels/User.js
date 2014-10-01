var Types = require('mongoose-simpledb').Types;

exports.schema = {
  name: {
    first: String,
    last: String
  },
  facebookId: String,
  googleId: String,
  twitterId: String,
  email: String,
  password: String,
  superAdmin: Boolean,
  joinDate: { type: Date, default: Date.now() },
  lastActive: { type: Date, default: Date.now() }
};

exports.virtuals = {
  'name.full': {
    get: function () {
      return this.name.first + ' ' + this.name.last;
    }
  }
};

exports.methods = {
  isAdmin: function () {
    return true;
  }
};
