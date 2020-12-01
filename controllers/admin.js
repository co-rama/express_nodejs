const Product = require("../models/product");

const someError = (err) => {
  const error = new Error(err);
  // error.httpStatusCode(500);
  return error;
};
exports.getAddProduct = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if(!image){
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
    }); 
  }
  const imageUrl = image.path;
  
  const product = new Product({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description,
    userID: req.user,
  });
  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // console.log(err);
      // res.redirect('/500');
      next(someError(err));
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (editMode !== "true") {
    // console.log(editMode);
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findOne({ _id: prodId, userID: req.userID })
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => {
      // console.log(err);
      next(someError(err));
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;
  Product.findOne({ _id: prodId, userID: req.user })
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if(image){
        product.imageUrl = image.path;
      }
      product.userID = req.user;
      return product.save();
    })
    .then((result) => {
      // console.log("UPDATED PRODUCT!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // console.log(err);
      next(someError(err));
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userID: req.user })
    //   .select('')
    //   .populate('')
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      next(someError(err));
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userID: req.user })
    .then((result) => {
      // console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      // console.log(err);
      // res.redirect("/500");
      next(someError(err));
    });
};
