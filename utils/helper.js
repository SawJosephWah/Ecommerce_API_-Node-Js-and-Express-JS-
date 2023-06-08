const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const path = require('path');



const generatePasswordHash = async (password) => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
}

const checkPassword = async (plainTextPassword, hashedPassword) => {
    const match = await bcrypt.compare(plainTextPassword, hashedPassword);
    return match;
};

const generateToken = (payload) => {
    const secretKey = process.env.SECRET_KEY;
    return jwt.sign(payload, secretKey);
}

const singleFileUpload = (req, res, next) => {
    if (!req.files || !req.files.image) {
        next();
        // return res.status(400).json({ message: 'Image file not found' });
    } else {
        const image = req.files.image;
        const imageName = Date.now() + '_' + image.name;
        const uploadPath = path.join(__dirname, '../uploads/category', imageName);

        image.mv(uploadPath, (error) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to upload image' });
            }

            req.imageName = imageName;
            next();
        });
    }
}

const singleImageUpload = (upload) => {
    return (req, res, next) => {
        if (!req.files || !req.files.image) {
            next();
            // return res.status(400).json({ message: 'Image file not found' });
        } else {
            const image = req.files.image;
            const imageName = Date.now() + '_' + image.name;
            const uploadPath = path.join(__dirname, `../uploads/${upload}`, imageName);

            image.mv(uploadPath, (error) => {
                if (error) {
                    console.error(error);
                    return res.status(500).json({ message: 'Failed to upload image' });
                }

                req.imageName = imageName;
                next();
            });
        }
    }
}
const generateCategoryImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/category/${imageName}`;
}
const generateSubCategoryImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/subcategory/${imageName}`;
}

module.exports = {
    generatePasswordHash,
    checkPassword,
    generateToken,
    singleFileUpload,
    generateCategoryImageUrl,
    singleImageUpload,
    generateSubCategoryImageUrl
};