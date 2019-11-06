const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;

var staffSchema = new Schema({
  fname: String,
  lname: String,
  email: { type: String, lowercase: true },
  password: { type: String, default: "" },
  role: String,
  hasBeenAuthenticated: { type: Boolean, default: false },
  phonenumber: String
});

staffSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

staffSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

mongoose.model("staffs", staffSchema);
