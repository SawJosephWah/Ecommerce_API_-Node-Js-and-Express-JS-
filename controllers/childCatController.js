const SubCatModel = require('../models/subcat');
const ChildCatModel = require('../models/childCat');
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');
const rootDir = path.resolve(__dirname, '..');

const add = async (req, res, next) => {
    const name = req.body.name;
    const image = req.imageName;
    const subCatId = req.body.sub_cat_Id;

    let childCategory = await ChildCatModel.findOne({ name });
    if (childCategory) {
        return res.json({ status: false, msg: "Child category already exists" })
    }
    let subCategory = await SubCatModel.findById(subCatId);
    if (!subCategory) {
        return res.json({ status: false, msg: "Sub Category not found" });
    }

    let newChildCategory = await new ChildCatModel({ name, image, subCatId }).save();

    await SubCatModel.findByIdAndUpdate(
        subCategory._id,
        { $push: { childs: newChildCategory._id } }
    );
    res.status(200).json({ status: true, msg: 'Child Category created successfully' });
}

const all = async (req, res, next) => {
    try {
        const childCategories = await ChildCatModel.find().populate({
            path: 'subCatId',
            select: 'name',
        });
        const childCategoriesWithImageUrl = childCategories.map((child) => {
            return {
                _id: child._id,
                name: child.name,
                subCatId: child.subCatId,
                imageUrl: helper.generateChildCategoryImageUrl(req, child.image)
            };
        });
        res.status(200).json({ status: true, data: childCategoriesWithImageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch child categories' });
    }
}

const get = async (req, res) => {
    try {
        const childCat = await ChildCatModel.findById(req.params.id)
            .populate({
                path: 'subCatId',
                select: 'name',
            });
        if (!childCat) {
            return res.status(200).json({ status: false, msg: "Child Category not found" });
        }
        childCat.image = helper.generateChildCategoryImageUrl(req, childCat.image);
        res.status(200).json({ status: true, data: childCat });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Failed to fetch sub category' });
    }
}

const deleteChildCategory = async (req, res) => {
    try {
        const childCategory = await ChildCatModel.findById(req.params.id);
        if (!childCategory) {
            return res.status(200).json({ status: false, msg: "Child category not found" });
        }
        let image = childCategory.image;
        const imagePath = path.join(rootDir, '/uploads/childcategory', image);
        fs.unlinkSync(imagePath);

        await SubCatModel.findByIdAndUpdate(childCategory.subCatId, { $pull: { childs: childCategory._id } })
        await ChildCatModel.findByIdAndDelete(childCategory._id);

        return res.status(200).json({ status: true, msg: "Deleted child category successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Failed to delete child category' });
    }
}

const update = async (req, res) => {
    let id = req.params.id;
    let childCategory = await ChildCatModel.findById(id);
    if (childCategory) {
        let name = req.body.name;
        let image = req.imageName ? req.imageName : null;
        let data = image ? { name, image } : { name };
        await ChildCatModel.findByIdAndUpdate(id, data);
        if (image) {
            const imagePath = path.join(rootDir, '/uploads/childcategory', childCategory.image);
            fs.unlinkSync(imagePath);
        }
        res.json({ status: true, msg: 'Update Child Category successfully' });
    } else {
        return res.json({ status: false, msg: "Child Category not found" })
    }
}
module.exports = {
    add,
    all,
    get,
    deleteChildCategory,
    update
}