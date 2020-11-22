exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.cookies['isLoggedIn'];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn,
  });
};
exports.postLogin = (req, res, next) => {
  res.cookie("isLoggedIn", "true");
  res.redirect("/");
};
