const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');
const commonValidator = require('../validators/commonValidator');
const productValidator = require('../validators/ProductValidator');
const helper = require('../utils/helper')

router.get('/all', controller.all);
router.post('/store', commonValidator.checkToken, productValidator.productAlreadyExists, helper.multipleImageUpload("product"), controller.store);

router.get('/:id', commonValidator.checkObjectId, controller.get);
router.delete('/:id', commonValidator.checkObjectId, controller.deleteProduct);
router.patch('/:id', commonValidator.checkObjectId, controller.update);
router.get('/search-by-specific/:specify_name/:id', commonValidator.checkObjectId, controller.searchBySpecific);



module.exports = router;
