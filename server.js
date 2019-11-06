const express = require("express"),
  app = express(),
  ejs = require("ejs"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  layout = require("express-layout"),
  passport = require("passport"),
  cookieSession = require("cookie-session");

const config = require("./config/secret");
// const auth = require("./middlewares/requireLogin");
const adminAuth = require("./middlewares/adminAuth");
const addToCartAuth = require("./middlewares/addToCartAuth");
const orderRedirect = require("./middlewares/orderRedirect");
const auth = require("./middlewares/auth");
var http = require("http").Server(app);
var io = require("socket.io")(http);
//models
require("./models/User");
require("./models/Product");
require("./models/VerificationDB");
require("./models/Product");
require("./models/Category");
require("./models/Staff");
require("./models/Cart");
require("./models/Discount");
require("./models/Option");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride("_method"));
app.use(layout());
app.set("layouts", "./views/layouts");
app.set("layout", "layout");
//sessesion midleware
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [config.secret]
  })
);
const Cart = mongoose.model("carts");
const User = mongoose.model("users");
const Staff = mongoose.model("staffs");
////////////////////////passport config/////////////
app.use(passport.initialize()); //initialize passport
app.use(passport.session()); //for session handling (persistent logins)
app.use(async (req, res, next) => {
  res.locals.user = req.user;
  //  res.locals.staff = req.staff;
  //  const staff = req.staff ? req.staff._id : null;
  const userIsLoggedIn = req.user ? req.user._id : null;
  const userRole = req.user ? req.user.role : null;
  res.locals.cartCheckout_number = await Cart.find({
    user: userIsLoggedIn,
    hasCheckedout: false
  });
  //check if it is a staff or user loggedin
  res.locals.checkUser = await User.findOne({
    _id: userIsLoggedIn
  });
  res.locals.checkStaff = await Staff.findOne({
    _id: userIsLoggedIn
  });
  res.locals.displayOrderItems = function(str, qty, idx, array) {
    if (str !== "") {
      if (idx === array.length - 1) {
        return str + ":" + qty;
      }

      return str + ":" + qty + ",";
    } else {
      return str;
    }
  };
  res.locals.numberWithCommas = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  //  console.log(userIsLoggedIn);

  next();
});
//connect to db
mongoose.Promise = global.Promise;
mongoose.connect(config.database, function(err) {
  if (err) {
    console.log(err.message);
  } else {
    console.log("database connected");
  }
});

require("./routes/views")(app, auth);
require("./routes/adminApi")(app, adminAuth, orderRedirect);
require("./routes/auth")(app);
require("./routes/api")(app, addToCartAuth, io);
require("./socket/checkoutSocket")(app, io);

const port = process.env.PORT || 5001;
http.listen(port, () => {
  console.log("Javamasters connected successfully at port:", port);
});
