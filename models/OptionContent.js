const mongoose = require("mongoose");
const { Schema } = mongoose;

const optionContentSchema = new Schema({
  name: String
});

module.exports = optionContentSchema;
