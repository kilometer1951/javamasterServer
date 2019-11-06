const mongoose = require("mongoose");
const { Schema } = mongoose;

const discountSchema = new Schema({
  discount: String
});

mongoose.model("discounts", discountSchema);
