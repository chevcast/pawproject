var Types = require('mongoose-simpledb').Types;
var validators = require('../utilities/validators');

exports.schema = {
  name: {
    first: { type: String, required: 'Must include a first name.' },
    last: String
  },
  facebookId: String,
  googleId: String,
  twitterId: String,
  email: {
    type: String,
    required: 'An email is required.',
    validate: validators.email
  },
  password: {
    type: String,
    required: 'You must include a password.'
  },
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
