const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "products" },
  qty: { type: Number, default: 0 },
  price: String,
  added: { type: Boolean, default: true },
  discountIsApplied: { type: Boolean, default: false },
  optionSelected: [],
  discount: String
});

module.exports = itemSchema;
