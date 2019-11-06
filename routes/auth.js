const passport = require("passport");
const localAuth = require("../authentication/localAuth");
const mongoose = require("mongoose");
const User = mongoose.model("users");
//const VerificationDB = mongoose.model("verificationDB");
// Twilio Credentials

const secret = require("../config/secret");
// require the Twilio module and create a REST client
//const client = require("twilio")(secret.accountSid, secret.authToken);

module.exports = app => {
  // app.post("/auth/sendVerification", async (req, res) => {
  //   //check if user already has a verification code
  //   User.findOne({ phonenumber: req.body.data }, async function(
  //     err,
  //     existingUser
  //   ) {
  //     if (existingUser) {
  //       //if user exist redirect to login page
  //       return res.send({
  //         userexist: true
  //       });
  //     } else {
  //       //user does not exist save and create new verification code
  //       //1. check if verification code exist
  //       const code = Math.floor(Math.random() * 100) + 900;
  //       VerificationDB.findOne(
  //         { phonenumber: "+1" + req.body.data },
  //         async function(err, result) {
  //           if (result) {
  //             //update verification code
  //             const updated = await VerificationDB.update(
  //               {
  //                 phonenumber: "+1" + req.body.data
  //               },
  //               {
  //                 $set: { code: code }
  //               },
  //
  //               {
  //                 safe: true,
  //                 multi: true
  //               }
  //             );
  //           } else {
  //             //first time
  //             const varificationDetails = {
  //               phonenumber: "+1" + req.body.data,
  //               code: code
  //             };
  //             const verification = await new VerificationDB(
  //               varificationDetails
  //             ).save();
  //           }
  //         }
  //       );
  //
  //       //  send sms
  //       client.messages.create(
  //         {
  //           to: "+1" + req.body.data,
  //           from: "+17733659134",
  //           body: "Drink Coffee Signup.Your verification code is " + code
  //         },
  //         (err, message) => {
  //           if (message === undefined) {
  //             return res.send({ smserror: true });
  //           } else {
  //             return res.send({ suc: true });
  //           }
  //         }
  //       );
  //     }
  //   });
  // });

  // app.post("/auth/checkVerificationCode", async (req, res) => {
  //   const vCode =
  //     req.body.data.code1 + "" + req.body.data.code2 + "" + req.body.data.code3;
  //
  //   VerificationDB.findOne(
  //     { phonenumber: "+1" + req.body.data.phonenumber, code: vCode },
  //     async function(err, result) {
  //       if (result) {
  //         if (vCode === result.code) {
  //           return res.send(true);
  //         }
  //       } else {
  //         return false;
  //       }
  //     }
  //   );
  // });
  app.post("/auth/signupauthentication", async (req, res, next) => {
    //check if user exist
    //  check if user already exist
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        //if user exist redirect to login page
        console.log("user exist");
        return res.send({
          suc: false
        }); //res.send({ error: "User Already exist try signing in " });
      } else {
        //user does not exist save and authenticate user
        var newUser = new User();
        newUser.name = req.body.name;
        newUser.email = req.body.email;
        newUser.phonenumber = req.body.phonenumber;
        newUser.password = newUser.encryptPassword(req.body.password);
        newUser.save(function(err) {
          //  log the user in after you save
          req.logIn(newUser, function(err) {
            if (err) {
              console.log(err);
              return next(err);
            } else {
              //  console.log(req.body);
              return res.send({
                suc: true,
                user: newUser
              });
            }
          });
        });
      }
    });
    //save the user and authenticate
  });

  //LOGIN
  app.post("/auth/loginauthentication", (req, res, next) => {
    passport.authenticate("local-login", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ suc: false });
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        return res.send({ suc: true, user });
      });
    })(req, res, next);
  });

  //logout
  app.get("/api/logout", (req, res) => {
    req.logout();
    res.redirect("/mobileApp/products");
  });
};
