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

    let subCategory = await SubCatModel.findOne({ name });
    if (subCategory) {
        return res.json({ status: false, msg: "Sub category already exists" })
    }
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
        const subCategories = await SubCatModel.find()
            .populate({
                path: 'catId',
                select: 'name',
            }).
            populate({
                path: 'childs',
                select: 'name',
            });
        const subCategoriesWithImageUrl = subCategories.map((category) => {
            return {
                _id: category._id,
                name: category.name,
                catId: category.catId,
                childs: category.childs,
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
        const subCategory = await SubCatModel.findById(req.params.id)
            .populate({
                path: 'catId',
                select: 'name',
            })
            .populate({
                path: 'childs',
                select: 'name',
            });
        if (!subCategory) {
            return res.status(200).json({ status: false, msg: "Sub Category not found" });
        }
        subCategory.image = helper.generateSubCategoryImageUrl(req, subCategory.image);
        res.status(200).json({ status: true, data: subCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch sub category' });
    }
}

const deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCatModel.findById(req.params.id);
        if (!subCategory) {
            return res.status(200).json({ status: false, msg: "Category not found" });
        }
        let image = subCategory.image;
        const imagePath = path.join(rootDir, '/uploads/subcategory', image);
        fs.unlinkSync(imagePath);

        await CategoryModel.findByIdAndUpdate(subCategory.catId, { $pull: { subcats: subCategory._id } })
        await SubCatModel.findByIdAndDelete(subCategory._id);

        return res.status(200).json({ status: true, msg: "Deleted sub category successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to delete category' });
    }
}

const update = async (req, res) => {
    let id = req.params.id;
    let SubCategory = await SubCatModel.findById(id);
    if (SubCategory) {
        let name = req.body.name;
        let image = req.imageName ? req.imageName : null;
        let data = image ? { name, image } : { name };
        await SubCatModel.findByIdAndUpdate(id, data);
        if (image) {
            const imagePath = path.join(rootDir, '/uploads/subcategory', SubCategory.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ status: true, msg: 'Update Sub Category successfully' });
    } else {
        return res.json({ status: false, msg: "Sub Category not found" })
    }
}
module.exports = {
    add,
    all,
    get,
    deleteSubCategory,
    update
}