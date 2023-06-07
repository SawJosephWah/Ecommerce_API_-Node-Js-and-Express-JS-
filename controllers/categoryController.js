const CategoryModel = require('../models/category');
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..');

const add = async (req, res, next) => {
    const name = req.body.name;
    const image = req.imageName;
    let checkAlreadyExists = await CategoryModel.findOne({ name });
    if (checkAlreadyExists) {
        return res.json({ status: false, msg: "Category name already exists" });
    }

    await new CategoryModel({ name, image }).save();
    res.status(200).json({ status: true, msg: 'Category created successfully' });
}

const all = async (req, res, next) => {
    try {
        const categories = await CategoryModel.find();
        const categoriesWithImageUrl = categories.map((category) => {
            return {
                name: category.name,
                imageUrl: helper.generateCategoryImageUrl(req, category.image)
            };
        });
        res.status(200).json({ status: true, data: categoriesWithImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch categories' });
    }
}

const get = async (req, res) => {
    try {
        const category = await CategoryModel.findById(req.params.id)
        if (!category) {
            res.status(200).json({ status: false, msg: "Category not found" });
        }
        category.image = helper.generateCategoryImageUrl(req, category.image);
        res.status(200).json({ status: true, data: category });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch category' });
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await CategoryModel.findByIdAndDelete(req.params.id);
        let image = category.image;
        if (!category) {
            return res.status(200).json({ status: false, msg: "Category not found" });
        }
        
        const imagePath = path.join(rootDir, '/uploads/category', image);
        fs.unlinkSync(imagePath);
        return res.status(200).json({ status: true, msg: "Deleted category successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to delete category' });
    }
}
module.exports = {
    add,
    all,
    get,
    deleteCategory
}