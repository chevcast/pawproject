exports.schema = {
  url: String,
  count: Number,
  triggered: [{
    date: Date,
    ip: String
  }]
};
