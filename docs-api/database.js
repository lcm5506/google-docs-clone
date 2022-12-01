const mongoose = require("mongoose");

// const Document = require("./Document");

const connection = mongoose.createConnection(
  "mongodb://localhost/google-docs-clone",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Document = new mongoose.Schema({
  _id: String,
  data: Object,
});

module.exports = connection.model("Document", Document);
