const RoleModel = require('../models/role');
const { ObjectId } = require('mongoose').Types;
const { body, validationResult } = require('express-validator');

let roleAlreadyExists = async (req, res, next) => {
    let { name } = req.body;
    let role = await RoleModel.findOne({ name });
    if (role) {
        return res.json({
            "status": false,
            "msg": "Role name already exists",
        });
    } else {
        next();
    }
}

let chackRoleIdAndPermitId = async (req, res, next) => {
    const roleId = req.body.role_id;
    const permitId = req.body.permit_id;
    if (!ObjectId.isValid(roleId)) {
        return res.status(400).json({ status: false, msg: 'Invalid role ID' });
    }
    if (!ObjectId.isValid(permitId)) {
        return res.status(400).json({ status: false, msg: 'Invalid permit ID' });
    }

    next();

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
    roleAlreadyExists,
    validateForm,
    chackRoleIdAndPermitId
};