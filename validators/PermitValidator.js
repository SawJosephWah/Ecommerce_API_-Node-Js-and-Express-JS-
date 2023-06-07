const PermitModel = require('../models/permit');
const { body, validationResult } = require('express-validator');

let permitAlreadyExists = async (req, res, next) => {
    let { name } = req.body;
    let permit = await PermitModel.findOne({ name });
    if (permit) {
        return res.json({
            "status": false,
            "msg": "Permit name already exists",
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
    permitAlreadyExists,
    validateForm
};