const express = require('express');
const { body, validationResult } = require('express-validator');

const validateForm = [
    body('name').notEmpty().withMessage('Name is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorResponse = {};
            errors.array().forEach(error => {
                errorResponse[error.path] = error.msg;
            });
            return res.status(400).json({ status: false, message: errorResponse });
        }
        return next();
    }
]

const validateLoginForm = [
    body('phone').notEmpty().withMessage('Phone is required'),
    body('password').notEmpty().withMessage('Password is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorResponse = {};
            errors.array().forEach(error => {
                errorResponse[error.path] = error.msg;
            });
            return res.status(400).json({ status: false, message: errorResponse });
        }
        return next();
    }
]

module.exports = {
    validateForm,
    validateLoginForm
};