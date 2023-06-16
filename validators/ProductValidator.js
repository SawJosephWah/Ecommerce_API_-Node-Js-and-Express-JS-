const ProductModel = require('../models/product');
const { body, validationResult } = require('express-validator');

let productAlreadyExists = async (req, res, next) => {
    let { name } = req.body;
    let product = await ProductModel.findOne({ name });
    if (product) {
        return res.json({
            "status": false,
            "msg": "Product name already exists",
        });
    } else {
        next();
    }
}

module.exports = {
    productAlreadyExists,
};