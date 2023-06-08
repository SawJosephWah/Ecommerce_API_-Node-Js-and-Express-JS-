const SubCatModel = require('../models/subcat');
const CategoryModel = require('../models/category');
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..');

const add = async (req, res, next) => {
    const name = req.body.name;
    const image = req.imageName;
    const catId = req.body.cat_id;

    let category = await CategoryModel.findById(catId);
    if (!category) {
        return res.json({ status: false, msg: "Category not found" });
    }

    let newSubCategory = await new SubCatModel({ name, image, catId }).save();

    await CategoryModel.findByIdAndUpdate(
        catId,
        { $push: { subcats: newSubCategory._id } }
    );
    res.status(200).json({ status: true, msg: 'Sub Category created successfully' });
}

const all = async (req, res, next) => {
    try {
        const subCategories = await SubCatModel.find().populate({
            path: 'catId',
            select: 'name',
        });
        const subCategoriesWithImageUrl = subCategories.map((category) => {
            return {
                _id: category._id,
                name: category.name,
                catId: category.catId,
                imageUrl: helper.generateSubCategoryImageUrl(req, category.image)
            };
        });
        res.status(200).json({ status: true, data: subCategoriesWithImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch subcategories' });
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

const update = async (req, res) => {
    let id = req.params.id;
    let category = await CategoryModel.findById(id);
    if (category) {

        let name = req.body.name;
        let image = req.imageName ? req.imageName : null;
        let data = image ? { name, image } : { name };
        await CategoryModel.findByIdAndUpdate(id, data);
        if (image) {
            const imagePath = path.join(rootDir, '/uploads/category', category.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ status: true, msg: 'Update Category successfully' });
    } else {
        return res.json({ status: false, msg: "Category not found" })
    }
}
module.exports = {
    add,
    all,
    get,
    deleteCategory,
    update
}