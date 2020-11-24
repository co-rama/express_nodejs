const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { use } = require("../routes/shop");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const companyMail = "smartfleekmarket@gmail.com";
const accessor = "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: companyMail,
    pass: accessor,
  },
});

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.cookies['isLoggedIn'];
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
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
              text: "You successfully signed up to Smartfleek",
            })
            .catch((err) => {});
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
    isAuthenticated: isLoggedIn,
  });
};
