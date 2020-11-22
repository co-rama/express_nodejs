const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userID: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
});

module.exports = mongoose.model("Product", productSchema);

// class Product {
//   constructor(_id, title, price, description, imageUrl, userID) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = _id;
//     this.userID = userID;
//   }
//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       //Update the product
//       dbOp = db.collection("products").updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         {
//           $set: {
//             title: this.title,
//             imageUrl: this.imageUrl,
//             description: this.description,
//             price: this.price,
//           },
//         }
//       );
//     } else {
//       // Create the product
//       dbOp = db.collection("products").insertOne(this);
//     }
//     return dbOp
//       .then((results) => {})
//       .catch((err) => console.log(err));
//   }
//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({})
//       .toArray()
//       .then((products) => products)
//       .catch((err) => console.log(err));
//   }
//   static fetchOne(id) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ _id: new mongodb.ObjectId(id) })
//       .next()
//       .then((product) => {
//         return product;
//       })
//       .catch((err) => console.log(err));
//   }
//   static deleteOne(id){
//     const db = getDb();
//     return db.collection('products')
//     .deleteOne({_id: new mongodb.ObjectId(id)})
//     .then(results => {})
//     .catch(error => {console.log(error)})
//   }
// }

// module.exports = Product;
