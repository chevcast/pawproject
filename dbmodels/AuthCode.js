var uuid = require('node-uuid');

exports.schema = {
  code: { type: String, default: uuid.v4().replace(/-/g, '') }
  // TODO: Store what role the auth code is valid for.
  // For now all codes will yield a super admin user.
};
