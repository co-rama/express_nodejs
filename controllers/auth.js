const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const crypto = require("crypto");
const user = require("../models/user");
require("dotenv").config();

const companyMail = process.env.EMAIL;
const accessor = process.env.PASSWORD;
const URL = process.env.URL;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: companyMail.trim(),
    pass: accessor.trim(),
  },
});

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.cookies['isLoggedIn'];
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
  });
};
exports.postLogin = (req, res, next) => {
  // res.cookie("isLoggedIn", "true", {httpOnly: true, });
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/auth/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              res.redirect("/");
            });
          } else {
            res.redirect("/auth/login");
          }
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/auth/login");
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/auth/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/auth/login");
          transporter
            .sendMail({
              from: companyMail,
              to: email,
              subject: "SIGNUP SUCCESS",
              html: "<h3>You successfully signed up to Smartfleek</h3>",
            })
            .then((result) => console.log(result.response))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err.message));
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getSignup = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp",
  });
};

exports.getReset = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset",
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(256, (err, buffer) => {
    if (err) {
      res.redirect("../login");
      return console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.redirect("/auth/reset");
        }
        user.resetToken = token; 
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        // transporter
        //   .sendMail({
        //     from: companyMail,
        //     to: req.body.email,
        //     subject: "PASSWORD RESET",
        //     html: `
        //   <h3>You requested a password reset, if NOT then ignore this email!</h3>
        //   <p>Click this<a href="${URL}/auth/reset/${token}"> link </a>to set a new password</p>
        // `,
        //   })
        //   .then((info) => console.log(info.response))
        //   .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
    .then((user) => {
      if(!user){
        return redirect('/auth/reset');
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        userId: user._id ? user._id.toString() : null,
        passwordToken : token
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;
  User.findOne({
    _id: userId,
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return redirect("/auth/reset");
      }
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/auth/login');
    })
    .catch((err) => console.log(err));
};
