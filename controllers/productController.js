const ProductModel = require('../models/product')
const helper = require('../utils/helper')
const mongoose = require('mongoose')

// Define the common populate attribute
const commonPopulate = [
    { path: 'cat', select: 'name' },
    { path: 'subcat', select: 'name' },
    { path: 'childcat', select: 'name' },
    { path: 'tag', select: 'name' },
    { path: 'delivery', select: 'name' },
    { path: 'warrenty', select: 'name' },
];
let all = async (req, res, next) => {
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const perPage = 5;

        const totalCount = await ProductModel.countDocuments();

        const totalPages = Math.ceil(totalCount / perPage);

        const adjustedPageNumber = pageNumber < 1 ? 1 : pageNumber > totalPages ? totalPages : pageNumber;

        const skipCount = (adjustedPageNumber - 1) * perPage;

        const data = await ProductModel.find().skip(skipCount).limit(perPage).populate(commonPopulate);

        data.forEach(el => {
            el.images = el.images.map(image => helper.generateProductImageUrl(req, image));
        })
        const protocol = req.protocol;
        const host = req.get('host');
        const currentPageUrl = `${protocol}://${host}${req.originalUrl.split('?')[0]}`;
        const nextPage = adjustedPageNumber < totalPages ? `${currentPageUrl}?page=${adjustedPageNumber + 1}` : null;
        const previousPage = adjustedPageNumber > 1 ? `${currentPageUrl}?page=${adjustedPageNumber - 1}` : null;

        return res.json({
            totalCount,
            data,
            currentPage: adjustedPageNumber,
            nextPage,
            previousPage,
            totalPages,
        });
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Internal Server Error');
    }
}

let store = async (req, res, next) => {
    let product = await ProductModel.findOne({ name: req.body.name });
    if (product) {
        return res.json({ "status": false, "msg": "Product already exists" });
    }
    await new ProductModel(req.body).save();
    return res.json({ "status": true, "msg": "Product created successfully" });
}

let get = async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id).populate(commonPopulate);
    if (!product) {
        return res.json({ "status": false, "msg": "Product do not found" });
    }
    return res.json({ "status": true, "data": product });
}

let deleteProduct = async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id);
    if (!product) {
        return res.json({ "status": false, "msg": "Product do not found" });
    }
    await ProductModel.findByIdAndDelete(req.params.id);
    return res.json({ "status": true, "msg": "Product deleted successfully" });
}

let update = async (req, res, next) => {
    let product = await ProductModel.findById(req.params.id);
    if (!product) {
        return res.json({ "status": false, "msg": "Product do not found" });
    }
    await ProductModel.findByIdAndUpdate(req.params.id, req.body);
    return res.json({ "status": true, "msg": "Product updated successfully" });
}

let searchBySpecific = async (req, res, next) => {
    const paramType = req.params.specify_name;
    const searchValue = new mongoose.Types.ObjectId(req.params.id);
    try {
        const pageNumber = parseInt(req.query.page) || 1;
        const perPage = 10;

        const totalCount = await ProductModel.find({ [paramType]: searchValue }).countDocuments();
        if (totalCount == 0) {
            return res.status(500).json({ status: false, msg: 'Data is not found' });
        }

        const totalPages = Math.ceil(totalCount / perPage);

        const adjustedPageNumber = pageNumber < 1 ? 1 : pageNumber > totalPages ? totalPages : pageNumber;

        const skipCount = (adjustedPageNumber - 1) * perPage;
        const data = await ProductModel.find({ [paramType]: searchValue }).skip(skipCount).limit(perPage).populate(commonPopulate);

        data.forEach(el => {
            el.images = el.images.map(image => helper.generateProductImageUrl(req, image));
        })

        const nextPage = adjustedPageNumber < totalPages ? adjustedPageNumber + 1 : null;
        const previousPage = adjustedPageNumber > 1 ? adjustedPageNumber - 1 : null;

        return res.json({
            totalCount,
            data,
            currentPage: adjustedPageNumber,
            nextPage,
            previousPage,
            totalPages,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}

module.exports = {
    all,
    store,
    get,
    deleteProduct,
    update,
    searchBySpecific
}