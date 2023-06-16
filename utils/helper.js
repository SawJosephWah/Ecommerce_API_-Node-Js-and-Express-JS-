const bcrypt = require('bcrypt');
require('dotenv').config()
const jwt = require("jsonwebtoken");
const path = require('path');
const mongoose = require('mongoose');


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

const multipleImageUpload = (upload) => {
    return async (req, res, next) => {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).send('No files were uploaded.');
            }
            const uploadedFiles = req.files.images;
            const imageNames = [];

            const modifyFileName = (file) => {
                const currentTimeStamp = new Date().getTime();
                const modifiedFileName = `${currentTimeStamp}_${file.name}`;
                return modifiedFileName;
            };

            let uploadCount = 0;
            for (const file of uploadedFiles) {
                const modifiedFileName = modifyFileName(file);
                const uploadPath = path.join(__dirname, '../uploads', 'product', modifiedFileName);

                file.mv(uploadPath, (error) => {
                    if (error) {
                        console.error('Error uploading file:', error);
                    } else {
                        imageNames.push(modifiedFileName);
                    }

                    uploadCount++;

                    if (uploadCount === uploadedFiles.length) {
                        req.body.images = imageNames;
                        next();
                    }
                });
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
const generateCategoryImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/category/${imageName}`;
}
const generateSubCategoryImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/subcategory/${imageName}`;
}
const generateChildCategoryImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/childcategory/${imageName}`;
}
const generateTagImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/tag/${imageName}`;
}
const generateDeliveryImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/delivery/${imageName}`;
}
const generateWarrentyImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/warrenty/${imageName}`;
}
const generateProductImageUrl = (req, imageName) => {
    return `${req.protocol}://${req.get('host')}/uploads/product/${imageName}`;
}

module.exports = {
    generatePasswordHash,
    checkPassword,
    generateToken,
    singleFileUpload,
    generateCategoryImageUrl,
    singleImageUpload,
    generateSubCategoryImageUrl,
    generateChildCategoryImageUrl,
    generateTagImageUrl,
    generateDeliveryImageUrl,
    generateWarrentyImageUrl,
    multipleImageUpload,
    generateProductImageUrl
};