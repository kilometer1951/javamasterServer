const mongoose = require("mongoose");
const { Schema } = mongoose;
const itemSchema = require("./Item");

const cartSchema = new Schema({
  dateAdded: { type: Date, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "users" },
  items: [itemSchema],
  hasCheckedout: { type: Boolean, default: false },
  subTotal: String,
  stripeFee: String,
  tax: String,
  total: String,
  orderShipped: { type: Boolean, default: false },
  orderIsComplete: { type: Boolean, default: false }
});

mongoose.model("carts", cartSchema);
