const mongoose = require("mongoose");
const Cart = mongoose.model("carts");
var fetchFunction = {};

//capitalize first words
fetchFunction.fetchCartNotCheckout = async function(req, res) {
  const getCart = await Cart.find({
    user: req.user._id,
    hasCheckedout: false
  })
    .populate("items.products")
    .sort("-_id");
  return res.send(getCart);
};

// fetchFunction.fetchCartInvoice = function(cart) {
//   return cart;
// };

module.exports = fetchFunction;
