exports.schema = {
  url: String,
  redirectUrl: String,
  count: Number,
  triggered: [{
    date: Date,
    ip: String
  }]
};
