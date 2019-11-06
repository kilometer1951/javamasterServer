const mongoose = require("mongoose");
const { Schema } = mongoose;

const productOptionSchema = new Schema({
  OptionName_id: { type: Schema.Types.ObjectId, ref: "options" }
});

module.exports = productOptionSchema;
