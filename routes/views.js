const mongoose = require("mongoose");
const Product = mongoose.model("products");

module.exports = (app, auth) => {
  app.get("/mobileApp/splash", async (req, res) => {
    res.render("splash", { layout: false });
  });

  app.get("/mobileApp/auth", auth, async (req, res) => {
    res.render("auth", { layout: false });
  });

  app.get(
    "/mobileApp/payment/:subTotal/:stripeFee/:tax/:total/:cartID",
    async (req, res) => {
      const subTotal = req.params.subTotal;
      const stripeFee = req.params.stripeFee;
      const tax = req.params.tax;
      const total = req.params.total;
      const cartID = req.params.cartID;
      res.render("payment", {
        layout: false,
        subTotal,
        stripeFee,
        tax,
        total,
        cartID
      });
    }
  );

  app.get("/mobileApp/succMessage/:msg/:cartID", async (req, res) => {
    res.render("succMessage", {
      layout: false,
      msg: req.params.msg,
      cartID: req.params.cartID
    });
  });

  app.get("/mobileApp/products", async (req, res) => {
    res.render("products", { layout: "appLayout" });
  });
};
