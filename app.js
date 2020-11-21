const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoose = require("mongoose");
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  User.fetchUser("5fb1c6a82eebf91364e82c55")
    .then((user) => {
      req.user = new User(user._id, user.username, user.email, user.cart);
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    "mongodb+srv://ramadhan:ramadhan@rest.c8dmh.mongodb.net/stage_1?retryWrites=true&w=majority",
    {useNewUrlParser: true, useUnifiedTopology: true}
  )
  .then((result) => {
    app.listen(3000);
    console.log('Connected');
  }).catch(err => {
    console.log(err.message);
  })
