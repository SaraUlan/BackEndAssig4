const mongoose = require("mongoose");

function connectToDatabase(uri) {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectToDatabase;
