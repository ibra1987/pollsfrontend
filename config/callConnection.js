const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

const DBConnect =() => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    
  }
  await mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,

    useNewUrlParser: true,
  });

  return handler(req, res);
};

module.exports = DBConnect;
