class User {
  // constructor(userID, username, email, cart) {
  //   this.username = username;
  //   this.email = email;
  //   this.cart = cart; //{items :[]}
  //   this._id = userID ? new mongodb.ObjectId(userID) : null;
  // }
  // save() {
  //   const db = getDb();
  //   return db.collection("users").insertOne(this);
  // }
  // addToCart(product) {
  //   const cartProductIndex = this.cart.items.findIndex(
  //     (cp) => cp.productId.toString() === product._id.toString()
  //   );
  //   const updatedCartItems = [...this.cart.items];
  //   let newQuantity = 1;
  //   if (cartProductIndex >= 0) {
  //     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
  //     updatedCartItems[cartProductIndex].quantity = newQuantity;
  //   } else {
  //     updatedCartItems.push({
  //       productId: new mongodb.ObjectId(product._id),
  //       quantity: newQuantity,
  //     });
  //   }
  //   const updatedCart = {
  //     items: updatedCartItems,
  //   };
  //   const db = getDb();
  //   return db
  //     .collection("users")
  //     .updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
  // }
  // static fetchUser(id) {
  //   const db = getDb();
  //   return db.collection("users").findOne({ _id: new mongodb.ObjectId(id) });
  // }
  // getCart() {
  //   const db = getDb();
  //   const productIds = this.cart.items.map((i) => {
  //     return i.productId;
  //   });
  //   return db
  //     .collection("products")
  //     .find({ _id: { $in: productIds } })
  //     .toArray()
  //     .then((products) => {
  //       return products.map((p) => {
  //         return {
  //           ...p,
  //           quantity: this.cart.items.find((i) => {
  //             return i.productId.toString() === p._id.toString();
  //           }).quantity,
  //         };
  //       });
  //     })
  //     .catch((error) => console.log(error));
  // }
  // deleteCart(productId) {
  //   const db = getDb();
  //   const updatedCartItems = this.cart.items.filter((item) => {
  //     return item.productId.toString() !== productId.toString();
  //   });
  //   return db.collection("users").updateOne(
  //     {
  //       _id: this._id,
  //     },
  //     { $set: { cart: { items: updatedCartItems } } }
  //   );
  // }
  // addOrder() {
  //   const db = getDb();
  //   return this.getCart()
  //     .then((products) => {
  //       const order = {
  //         items: products,
  //         user: {
  //           _id: this._id,
  //           email: this.email,
  //         },
  //       };
  //       return db.collection("orders").insertOne(order);
  //     })
  //     .then((result) => {
  //       this.cart = { items: [] };
  //       return db
  //         .collection("users")
  //         .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
  //     });
  // }
  // getOrders() {
  //   const db = getDb();
  //   return db.collection("orders").find({ "user._id": this._id }).toArray();
  // }
}

module.exports = User;
