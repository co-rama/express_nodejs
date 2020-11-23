const User = require("../models/user");

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
  User.findById("5fb8dc26f31956646dc48b3f")
    .then((user) => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(err => {
        if(err){
          console.log(err);
        }
        res.redirect("/");
      })
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

}
exports.getSignup = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "SignUp",
    isAuthenticated: isLoggedIn,
  });
};
