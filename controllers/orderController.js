const mongoose = require('mongoose');
const { ObjectId } = require('mongoose').Types;
const OrderModel = require('../models/order')
const OrderItemModel = require('../models/orderItem')
const UserModel = require('../models/user')
const ProductModel = require('../models/product')

let store = async (req, res, next) => {
    let userId = req.body.user_id;
    let products = req.body.products;
    const productIds = products.map((product) => product.id);

    //check object ids
    if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ status: false, msg: 'Invalid User Id' });
    }

    if (!areAllIdsValid(productIds)) {
        return res.status(400).json({ status: false, msg: 'Invalid Product Id. Check your products  ' });
    }

    let user = await UserModel.findById(req.body.user_id);
    if (!user) {
        return res.json({ status: true, msg: "User do not found" });
    }

    const existingProducts = await ProductModel.find({ _id: { $in: productIds } });
    if (existingProducts.length !== productIds.length) {
        return res.json({ status: true, msg: "Some products do not found . Check your products" });
    }
    // return res.json({ status: true, msg: "Order saved successfully" })
    let newOrder = await new OrderModel().save();
    let count = 0;
    let total = 0;
    let orderItems = [];

    products.forEach((product) => {
        existingProducts.forEach((existingProduct) => {
            if (new mongoose.Types.ObjectId(product.id).equals(existingProduct._id)) {
                orderItems.push({
                    orderId: newOrder._id,
                    count: product.count,
                    productId: existingProduct._id,
                    price: existingProduct.price * product.count,
                    status: "PENDING",
                });
                ++count;
                total = total + (existingProduct.price * product.count);
            }

        })
    })


    let insertedProducts = await OrderItemModel.insertMany(orderItems);
    const insertedIds = insertedProducts.map((product) => product._id);

    await OrderModel.findByIdAndUpdate(newOrder._id, {
        user: req.body.user_id,
        orderItems: insertedIds,
        count,
        total
    })
    return res.json({ status: true, msg: "Order saved successfully" })
}

let getUserOrder = async (req,res,next) => {
    let userId = req.params.id;
    let orders = await OrderModel.find({ user: userId })
    .populate({
        path: 'orderItems',
        select: 'count price productId',
        populate : {
            path:"productId",
            model: "Product",
            select : "name"
        }
    })
    .populate({
        path: 'user',
        select: 'name',
    });

    return res.json({ status: true, data: orders });
}


function areAllIdsValid(ids) {
    for (const id of ids) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return false; // Invalid ID found
        }
    }
    return true; // All IDs are valid
}
module.exports = {
    store,
    getUserOrder
}