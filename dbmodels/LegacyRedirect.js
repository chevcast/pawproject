exports.schema = {
  url: String,
  should404: Boolean,
  redirectUrl: String,
  count: Number,
  triggered: [{
    date: Date,
    ip: String,
    referrer: String
  }]
};
