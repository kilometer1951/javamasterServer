const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;
const productOptionSchema = require("./ProductOption");

var productSchema = new Schema({
  date: { type: Date, default: Date.now },
  name: String,
  image: String,
  price: String,
  description: String,
  calories: String,
  mainCategory: String,
  subCategory: String,
  option: [productOptionSchema],
  addedBy: { type: Schema.Types.ObjectId, ref: "staffs" },
  discount: String,
  discountIsApplied: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true }
});

mongoose.model("products", productSchema);
