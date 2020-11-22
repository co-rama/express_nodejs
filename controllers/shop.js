const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  const isLoggedIn = req.session.isLoggedIn;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  const isLoggedIn = req.session.isLoggedIn;
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const cart = user.cart.items;
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: cart,
        isAuthenticated: isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((results) => {
      res.redirect("/cart");
    })
    .catch((err) => console.log(err));
};

// exports.postCartDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   req.user
//     .deleteCart(prodId)
//     .then((result) => {
//       res.redirect("/cart");
//     })
//     .catch((err) => console.log(err));
// };

// exports.postOrder = (req, res, next) => {
//   req.user.addOrder()
//     .then(results => {
//       res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//  const isLoggedIn = req.session.isLoggedIn;
//   req.user
//     .getOrders()
//     .then(orders => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'Your Orders',
//         orders: orders,
//         isAuthenticated: isLoggedIn
//       });
//     })
//     .catch(err => console.log(err));
// };
