const mongoose = require("mongoose");
const Category = mongoose.model("categories");
const Product = mongoose.model("products");
const Staff = mongoose.model("staffs");
const Discount = mongoose.model("discounts");
const Option = mongoose.model("options");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");
const bcrypt = require("bcrypt-nodejs");
const passport = require("passport");
const localAuth = require("../authentication/localAuth");
const Cart = mongoose.model("carts");
const secret = require("../config/secret");
// require the Twilio module and create a REST client
const client = require("twilio")(secret.accountSid, secret.authToken);

//image upload
const multer = require("multer");
const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });

const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: "dtfyfl4kz",
  api_key: "223622844967433",
  api_secret: "r20BlHgHcoH8h-EznEJPQmG6sZ0"
});

module.exports = (app, adminAuth, orderRedirect) => {
  //VIEWS
  app.get("/adminApi/edit/staff/:id", async (req, res) => {
    const staff = await Staff.findOne(
      {
        _id: req.params.id
      },
      { fname: 1, lname: 1, email: 1, phonenumber: 1, role: 1 }
    );

    return res.send(staff);
  });

  app.get("/adminApi/maximizeOrder/:orderID", async (req, res) => {
    const orders = await Cart.find({
      _id: req.params.orderID
    })
      .populate("items.product")
      .populate("user");
    return res.send(orders);
  });
  app.get("/adminApi/discounts", async (req, res) => {
    const discount = await Discount.find({});
    return res.send(discount);
  });
  app.get("/adminApi/mainCategory", async (req, res) => {
    const category = await Category.find({});
    console.log(category);
    return res.send(category);
  });

  app.get("/adminApi/newStaff", adminAuth, async (req, res) => {
    res.render("admin/newstaff", { layout: "adminLayout" });
  });
  app.get("/adminApi/staffs", adminAuth, orderRedirect, async (req, res) => {
    const staffs = await Staff.find({});
    res.render("admin/staffs", { layout: "adminLayout", staffs });
  });
  app.get("/adminApi/products", adminAuth, orderRedirect, async (req, res) => {
    const products = await Product.find({});
    res.render("admin/products", { layout: "adminLayout", products });
  });

  app.get("/adminApi/newIncomingOrder/:id", adminAuth, async (req, res) => {
    const newIncomingOrder = await Cart.find({
      _id: req.params.id,
      orderIsComplete: false
    })
      .populate("items.product")
      .populate("user")
      .sort("-_id");
    console.log(newIncomingOrder);
    return res.send(newIncomingOrder);
  });
  app.get("/adminApi/orders", adminAuth, async (req, res) => {
    const orders = await Cart.find({
      hasCheckedout: true,
      orderIsComplete: false
    })
      .populate("items.product")
      .populate("user");

    res.render("admin/orders", { layout: "adminLayout", orders });
  });
  app.get("/adminApi/subCategory", adminAuth, async (req, res) => {
    const mainCategory = await Category.find({});
    const subCategory = await Category.find({
      $where: "this.subCategory.length > 0"
    });
    res.send({ subCategory, mainCategory });
  });
  app.get("/adminApi/option", adminAuth, async (req, res) => {
    const option = await Option.find({});
    res.send(option);
  });
  app.get("/adminApi/edit/subCategory/:id", adminAuth, async (req, res) => {
    const category = await Category.findOne({ _id: req.params.id });
    res.send(category);
  });
  app.get("/adminApi/fetchSubCat/:val", adminAuth, async (req, res) => {
    const category = await Category.findOne({
      _id: req.params.val
    });

    return res.send(category);
  });
  app.get("/adminApi/edit/option/:id", adminAuth, async (req, res) => {
    const option = await Option.findOne({ _id: req.params.id });
    res.send(option);
  });
  app.get("/adminApi/firstUse", async (req, res) => {
    res.render("admin/firstUse", { layout: false });
  });
  app.get(
    "/adminApi/newProduct",
    adminAuth,
    orderRedirect,
    async (req, res) => {
      const discounts = await Discount.find({});
      const categories = await Category.find({});
      const options = await Option.find({});
      res.render("admin/newProduct", {
        layout: "adminLayout",
        discounts,
        categories,
        options
      });
    }
  );
  app.get("/admin/login", async (req, res) => {
    if (req.user) {
      res.redirect("/admin");
    } else {
      res.render("admin/login", { layout: false });
    }
  });
  app.get("/admin", adminAuth, orderRedirect, async (req, res) => {
    res.render("admin/admin", { layout: "adminLayout" });
  });
  //POST API
  app.post("/adminApi/completeOrder", adminAuth, async (req, res) => {
    //update the cart and users info
    const updated = await Cart.update(
      {
        _id: req.body.orderID
      },
      {
        $set: { orderIsComplete: true }
      },

      {
        safe: true,
        multi: true
      }
    );
    return res.send({ suc: true });
  });
  app.post("/adminApi/edit/discount/:id", async (req, res) => {
    const updated = await Discount.update(
      {
        _id: req.params.id
      },
      {
        $set: {
          discount: req.body.newDiscountInput
        }
      },

      {
        safe: true,
        multi: true
      }
    );
    res.send(true);
  });
  app.post(
    "/adminApi/edit/subCategory/:categoryID/:subCategoryID",
    async (req, res) => {
      const updated = await Category.update(
        {
          _id: req.params.categoryID,
          subCategory: {
            $elemMatch: { _id: req.params.subCategoryID }
          }
        },
        {
          $set: { "subCategory.$.name": req.body.subCategoryField }
        }
      );
      return res.send(updated);
    }
  );
  app.post(
    "/adminApi/edit/option/:optionID/:optionContentID",
    async (req, res) => {
      const updated = await Option.update(
        {
          _id: req.params.optionID,
          optionContent: {
            $elemMatch: { _id: req.params.optionContentID }
          }
        },
        {
          $set: { "optionContent.$.name": req.body.optionContentField }
        }
      );
      return res.send(updated);
    }
  );
  app.post("/adminApi/edit/optionName/:optionID", async (req, res) => {
    const updated = await Option.update(
      {
        _id: req.params.optionID
      },
      {
        $set: {
          optionName: req.body.editOptionNameInput
        }
      },

      {
        safe: true,
        multi: true
      }
    );
    res.send(true);
  });
  app.post("/adminApi/edit/mainCategory/:id", async (req, res) => {
    const updated = await Category.update(
      {
        _id: req.params.id
      },
      {
        $set: {
          mainCategory: req.body.newMainCategoryInput
        }
      },

      {
        safe: true,
        multi: true
      }
    );
    res.send(true);
  });

  app.post("/adminApi/delete/mainCategory", async (req, res) => {
    const deleletedData = await Category.findOneAndDelete({
      _id: req.body.id
    });
    return res.send(deleletedData);
  });

  app.post("/adminApi/new/subCategory", async (req, res) => {
    const subCat = {
      name: req.body.newSubCategoryInput
    };
    const updated = await Category.update(
      { mainCategory: req.body.selectMainCategory },
      { $push: { subCategory: subCat } }
    );
    const subCategory = await Category.find({
      $where: "this.subCategory.length > 0"
    });
    return res.send({ subCategory });
  });

  app.post("/adminApi/add/optionContent/:id", async (req, res) => {
    const optionContentFields = {
      name: req.body.optionContent
    };
    const option = await Option.update(
      { _id: req.params.id },
      { $push: { optionContent: optionContentFields } }
    );
    return res.send(option);
  });

  app.post("/adminApi/delete/discount", async (req, res) => {
    const deleletedData = await Discount.findOneAndDelete({
      _id: req.body.id
    });
    return res.send(deleletedData);
  });
  app.post("/adminApi/new/mainCategory", async (req, res) => {
    const mainCategoryFields = {
      mainCategory: req.body.newMainCategoryInput
    };
    const category = await new Category(mainCategoryFields).save();
    return res.send(category);
  });

  app.post("/adminApi/new/option", async (req, res) => {
    const optionFields = {
      optionName: req.body.optionName
    };
    const option = await new Option(optionFields).save();
    console.log(option);
    return res.send(option);
  });

  app.post("/adminApi/edit/staff/:id", async (req, res) => {
    const updated = await Staff.update(
      {
        _id: req.params.id
      },
      {
        $set: {
          fname: req.body.fname,
          lname: req.body.lname,
          phonenumber: req.body.phonenumber,
          email: req.body.email,
          role: req.body.role
        }
      },

      {
        safe: true,
        multi: true
      }
    );
    res.redirect("/adminApi/staffs");
  });
  app.post("/adminApi/delete/staff", async (req, res) => {
    const deleletedData = await Staff.findOneAndDelete({
      _id: req.body.deleteID
    });
    return res.send(deleletedData);
  });
  app.post("/adminApi/updatePasswordForFirstUse", async (req, res) => {
    const staff = await Staff.findOne({
      _id: req.body.userid
    });
    //update the password and hasBeenAuthenticated
    if (staff.hasBeenAuthenticated) {
      //error password already updated
      return res.send({ succ: false });
    } else {
      //update password
      staff.password = bcrypt.hashSync(
        req.body.password,
        bcrypt.genSaltSync(10),
        null
      );
      staff.hasBeenAuthenticated = true;

      await staff.save();
      return res.send({ succ: true });
    }
  });
  app.post("/adminApi/firstUse", async (req, res) => {
    const staff = await Staff.find({
      _id: req.body.userid
    });
    return res.send(staff);
  });
  app.post("/adminApi/new/discount", async (req, res) => {
    const discountFields = {
      discount: req.body.newDiscountInput
    };
    const discount = await new Discount(discountFields).save();
    return res.send(discount);
  });

  app.post("/adminApi/new/newstaff", async (req, res) => {
    const staffFields = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      role: req.body.role,
      phonenumber: req.body.phonenumber
    };
    //chekc if user exist
    const staffs = await Staff.find({ email: req.body.email });
    console.log();
    if (staffs.length === 0) {
      //create staff
      const staff = await new Staff(staffFields).save();
      //send email to staff for first use
      const message = {
        body: `Hi ${req.body.lname}, here is your temp password: <span style="color:red;">${staff._id}</span>
          <a href="https://shielded-mesa-68633.herokuapp.com/adminApi/firstUse">click here to create a new password for first use thanks</a>
        `,
        recipient: req.body.email
      };
      const mailer = new Mailer(message, surveyTemplate(message));

      try {
        await mailer.send();
        console.log("email sent");
      } catch (err) {
        res.status(422).send(err);
      }
      //end
      return res.redirect("/adminApi/staffs");
    } else {
      return res.send({ succ: false });
    }
  });

  //upload products / new product
  app.post(
    "/adminApi/new/upload",
    upload.single("fileupload"),
    async (req, res) => {
      cloudinary.uploader.upload(req.file.path, async result => {
        //  console.log(req.body);
        const updated = await Product.update(
          {
            _id: req.body.productID
          },
          {
            $set: {
              image: result.secure_url
            }
          },

          {
            safe: true,
            multi: true
          }
        );

        return res.redirect("/adminApi/products");
      });
    }
  );

  app.post("/adminApi/new/product", async (req, res) => {
    //  save to db
    const req_body = {
      name: req.body.productName,
      price: req.body.price,
      addedBy: req.user._id,
      calories: req.body.calories,
      mainCategory: req.body.mainCategory,
      subCategory: req.body.subCategory,
      inStock: req.body.inStock,
      description: req.body.description,
      discount: req.body.discount,
      discountIsApplied: req.body.discount === "0" ? false : true
    };
    const product = await new Product(req_body).save();
    //push array of options
    req.body.arr.forEach(async function(data) {
      //update
      const optionContentFields = {
        OptionName_id: data
      };
      const updated = await Product.update(
        { _id: product._id },
        { $push: { option: optionContentFields } }
      );
    });

    return res.send(product);
  });

  //end upload

  //LOGIN
  app.post("/adminAuth/loginauthentication", (req, res, next) => {
    passport.authenticate("admin-local-login", (err, staff, info) => {
      if (err) {
        return next(err);
      }
      if (!staff) {
        return res.send({ suc: false });
      }
      req.logIn(staff, function(err) {
        if (err) {
          return next(err);
        }
        //  return res.send({ suc: true });
        return res.redirect("/admin");
      });
    })(req, res, next);
  });

  //logout
  app.get("/adminAuth/logout", (req, res) => {
    req.logout();
    res.redirect("/admin/login");
  });
};
