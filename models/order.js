const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderModel = new Schema({
    products: [
        {
            product : {type : Object, required : true},
            quantity : {type : Number, required: true}
        }
    ],
    user : {
        email : {
            type: String,
            required: true
        },
        userID: {
            type : Schema.Types.ObjectId,
            required : true,
            ref : 'User'
        }
    }
})


module.exports = mongoose.model('Order', orderModel);