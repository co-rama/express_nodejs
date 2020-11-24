const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const mongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
require('dotenv').config();

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGO_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const store = new mongoDbStore({
  uri: MONGO_URI,
  collection: "sessions",
});
const csrfProtection = csrf();
app.use(
  session({
    secret: "callback wizard",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken()
  next();
})

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use("/auth", authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    // User.findOne().then((foundUser) => {
    //   if (!foundUser) {
    //     const user = new User({
    //       name: "Corama",
    //       email: "coramayunus@gmail.com",
    //       cart: {
    //         items: [],
    //       },
    //     });
    //     user.save();
    //   }
    // });
    app.listen(PORT);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
