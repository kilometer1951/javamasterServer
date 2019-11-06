const mongoose = require("mongoose");
const stripe = require("stripe")("sk_test_v7ZVDHiaLp9PXgOqQ65c678g");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const Product = mongoose.model("products");
const Cart = mongoose.model("carts");
const FetchFunction = require("../fetchFunction/fetch");
const encryptPassword = require("../functions/encryptPassword");
const Category = mongoose.model("categories");
const User = mongoose.model("users");

module.exports = (app, addToCartAuth) => {
  app.get("/api/products", async (req, res) => {
    const products = await Product.find({ inStock: true }).populate("category");
    return res.send({ success: true, products });
  });
  app.get("/api/accountInfo", async (req, res) => {
    const user = await User.findOne({ _id: req.user._id });
    return res.send(user);
  });

  // app.get("/api/cart", async (req, res) => {
  //   const cartExist = await Cart.find({
  //     user: req.user._id,
  //     hasCheckedout: false
  //   });
  //   return res.send(cartExist);
  // });

  app.get("/api/products/:subCat", async (req, res) => {
    const products = await Product.find({ subCategory: req.params.subCat });
    console.log(products);
    res.send(products);
  });

  app.get("/api/featured", async (req, res) => {
    const featured = await Product.find({ discountIsApplied: true });
    res.send(featured);
  });

  app.get("/api/display/products/:id", async (req, res) => {
    const products = await Product.findOne({ _id: req.params.id }).populate(
      "option.OptionName_id"
    );

    const cart = await Cart.findOne({
      user: req.user ? req.user._id : null,
      hasCheckedout: false,
      items: {
        $elemMatch: { product: products._id }
      }
    });
    //  console.log(req.user);
    const hasItem = cart ? true : false;

    res.send({ products, hasItem });
  });
  app.get("/api/mainCategory", async (req, res) => {
    const category = await Category.find({});
    console.log(category);
    return res.send(category);
  });

  app.get("/api/edit/:itemID/:productID/:cartID", async (req, res) => {
    const product = await Product.findOne({
      _id: req.params.productID
    }).populate("option.OptionName_id");
    const carts = await Cart.findOne({
      _id: req.params.cartID
    });

    carts.items.forEach(function(cart) {
      if (cart._id.equals(req.params.itemID)) {
        res.send({ cart, product });
      }
    });
  });

  app.get("/api/cart", async (req, res) => {
    const cart = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    }).populate("items.product");
    //  console.log(cart);
    return res.send(cart);
  });
  app.get("/api/receipt", async (req, res) => {
    const cart = await Cart.find({
      user: req.user._id,
      hasCheckedout: true,
      orderIsComplete: true
    }).populate("items.product");
    //  console.log(cart);
    return res.send(cart);
  });
  app.post("/api/addToCart", addToCartAuth, async (req, res) => {
    //add to cart
    //check if cart has data
    const cartData = await Cart.findOne({
      user: req.user._id,
      hasCheckedout: false
    });
    const cartHasData = cartData ? true : false;
    const cartID = cartData ? cartData._id : "";

    const newCart = {
      user: req.user._id,
      items: {
        product: req.body.productID,
        qty: 1,
        price: req.body.productPrice,
        optionSelected: req.body.options
      }
    };

    if (cartHasData) {
      //update cart
      const items = {
        product: req.body.productID,
        qty: 1,
        price: req.body.productPrice,
        optionSelected: req.body.options
      };
      const cart = await Cart.update(
        { _id: cartID },
        { $push: { items: items } }
      );
    } else {
      //create cart
      const newCartData = await new Cart(newCart).save();
    }

    console.log(cartID);

    return res.send(true);
  });

  //update cart
  app.post("/api/updateCart", async (req, res) => {
    if (req.body.action === "inc") {
      const updated = await Cart.update(
        {
          _id: req.body.cartID,
          user: req.user._id,
          items: {
            $elemMatch: { product: req.body.productID }
          }
        },
        {
          $inc: { "items.$.qty": 1 },
          $set: { "items.$.price": req.body.totalPricePerItem }
        }
      );
      return res.send(true);
    }
    if (req.body.action === "dec") {
      const updated = await Cart.update(
        {
          _id: req.body.cartID,
          user: req.user._id,
          items: {
            $elemMatch: { product: req.body.productID }
          }
        },
        {
          $inc: { "items.$.qty": -1 },
          $set: { "items.$.price": req.body.totalPricePerItem }
        }
      );
      return res.send(true);
    }
  });
  // app.post("/api/updateCartOption", async (req, res) => {
  //   // const updated = await Cart.update(
  //   //   {
  //   //     _id: req.body.cartID,
  //   //     user: req.user._id,
  //   //     items: {
  //   //       $elemMatch: { product: req.body.productID }
  //   //     }
  //   //   },
  //   //   { $set: { "items.$.optionSelected": req.body.arr } }
  //   // );
  //
  //   console.log(req.body.arr);
  //
  //   //  return res.send(updated);
  // });
  app.post("/api/deleteCartItem", async (req, res) => {
    const updated = await Cart.update(
      {
        _id: req.body.cartID,
        user: req.user._id,
        hasCheckedout: false
      },
      {
        $pull: {
          items: {
            _id: req.body.itemID
          }
        }
      },

      {
        multi: true
      }
    );
    //get cart
    const cart = await Cart.find({
      user: req.user._id,
      hasCheckedout: false
    }).populate("items.product");
    //console.log(cart);
    return res.send(cart);
  });

  app.post("/api/checkout", async (req, res) => {
    //charge the customer update the db
    let amount = Math.round(parseFloat(req.body.total) * 100);
    stripe.customers
      .create({
        email: req.user.email
      })
      .then(function(customer) {
        return stripe.customers.createSource(customer.id, {
          source: req.body.token
        });
      })
      .then(function(source) {
        return stripe.charges.create({
          amount: amount,
          currency: "usd",
          customer: source.customer
        });
      })
      .then(async charge => {
        //update the cart
        const updated = await Cart.update(
          {
            _id: req.body.cartID
          },
          {
            $set: {
              subTotal: req.body.subTotal,
              stripeFee: req.body.stripeFee,
              tax: req.body.tax,
              total: req.body.total,
              hasCheckedout: true
            }
          },

          {
            safe: true,
            multi: true
          }
        );
        return res.send({ message: "suc" });
      })
      .catch(function(err) {
        // Deal with an error
        console.log(err);
        return res.send({ message: "error" });
      });
  });
  app.post("/api/updateAccount", async (req, res) => {
    if (req.body.updatePassword === "") {
      const updated = await User.update(
        {
          _id: req.user._id
        },
        {
          $set: {
            name: req.body.updateName,
            email: req.body.updateEmail
          }
        },

        {
          safe: true,
          multi: true
        }
      );
    } else {
      const updated = await User.update(
        {
          _id: req.user._id
        },
        {
          $set: {
            name: req.body.updateName,
            email: req.body.updateEmail,
            password: encryptPassword(req.body.updatePassword)
          }
        },

        {
          safe: true,
          multi: true
        }
      );
    }

    res.send(true);
  });
};
