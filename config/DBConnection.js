const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const DBConnect = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  await mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,

    useNewUrlParser: true,
  });

  return handler(req, res);
};

module.exports = DBConnect;
