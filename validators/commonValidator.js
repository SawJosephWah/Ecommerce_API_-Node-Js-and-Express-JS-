require('dotenv').config()
const { ObjectId } = require('mongoose').Types;
const customEerror = require('../helpers/customError');
const jwt = require("jsonwebtoken");

const checkObjectId = (req, res, next) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, msg: 'Invalid ID' });
    }

    // If validation passes, proceed to the next middleware/route handler
    next();
}

const checkToken = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token) {
        return next(new customEerror("Authentication error"), 200);
    }
    const secretKey = process.env.SECRET_KEY;
    try {
        token = token.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        return next(new customEerror("Authentication error"), 200);
    }

}

const validateSingleRole = (role) => {
    return (req, res, next) => {
        let exists = req.user.roles.some(userRole => userRole.name == role);
        if (!exists) {
            return next(new customEerror("You dont have permission"), 200)
        }
        next();
    }
}

const validateMultipleRoles = (roles) => {
    return (req, res, next) => {
        let check = false;
        for (const role of roles) {
            let exists = req.user.roles.some(userRole => userRole.name == role);
            if (exists) {
                check = true;
                break;
            }
        }

        if (!check) {
            return next(new customEerror("You dont have permission"), 200)
        }
        next();
    }
}

const validateMultiplePermits = (permits) => {
    return (req, res, next) => {
        let check = false;
        for (const permit of permits) {
            let exists = req.user.permits.some(userPermit => userPermit.name == permit);
            if (exists) {
                check = true;
                break;
            }
        }

        if (!check) {
            return next(new customEerror("You dont have permission"), 200)
        }
        next();
    }
}



module.exports = {
    checkObjectId,
    checkToken,
    validateSingleRole,
    validateMultipleRoles,
    validateMultiplePermits
};