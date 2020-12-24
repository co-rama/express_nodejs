const path = require("path");
const cookieParser = require("cookie-parser");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoose = require("mongoose");
const multer = require("multer");
const mongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const compression = require("compression");
// require("dotenv").config();

const errorController = require("./controllers/error");
const User = require("./models/user");

// const MONGO_URI = process.env.MONGODB_URI;
const MONGO_URI = `MONGODB_URI=mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@rest.c8dmh.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 3000;

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const store = new mongoDbStore(
  {
    uri: MONGO_URI,
    collection: "sessions",
  },
  (err) => {
    if (err) console.log(err);
  }
);
const csrfProtection = csrf();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    return cb(null, true);
  }
  cb(null, false);
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(compression());
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
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use("/auth", authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  console.log(error);
  res.redirect("/500");
});

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
