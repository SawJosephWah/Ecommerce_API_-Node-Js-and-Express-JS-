const CategoryModel = require('../models/category');
const { body, validationResult } = require('express-validator');

let categoryAlreadyExists = async (req, res, next) => {
    let { name } = req.body;
    let category = await CategoryModel.findOne({ name });
    if (category) {
        return res.json({
            "status": false,
            "msg": "Category name already exists",
        });
    } else {
        next();
    }
}



const validateForm = [
    body('name').notEmpty().withMessage('Name field is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorResponse = {
                status: false,
                errors: errors.array().reduce((acc, err) => {
                    acc[err.path] = err.msg;
                    return acc;
                }, {})
            };
            return res.status(400).json(errorResponse);
        }
        next();
    }
];


module.exports = {
    categoryAlreadyExists,
    validateForm
};