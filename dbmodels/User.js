var Types = require('mongoose-simpledb').Types;

exports.schema = {
  name: {
    first: String,
    last: String
  },
  roles: [{ type: Types.ObjectId, ref: 'Role' }],
  facebookId: String,
  email: String,
  password: String,
  bio: String,
  birthDate: Date,
  joinDate: Date,
  lastActive: Date,
};

exports.virtuals = {
  'name.full': {
    get: function () {
      return this.name.first + ' ' + this.name.last;
    }
  }
}
