const mongoose = require("mongoose");
const { Schema } = mongoose;

var verificationDBSchema = new Schema({
  phonenumber: String,
  code: String
});

mongoose.model("verificationDB", verificationDBSchema);
