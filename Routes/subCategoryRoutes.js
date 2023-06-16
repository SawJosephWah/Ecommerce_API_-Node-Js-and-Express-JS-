const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/subCatController');

router.post('/store', commonValidator.checkToken, helper.singleImageUpload('subcategory'), controller.add);
router.get('/all', controller.all);

router.route('/:id')
    .get(commonValidator.checkObjectId, controller.get)
    .delete(commonValidator.checkObjectId, controller.deleteSubCategory)
    .patch(commonValidator.checkObjectId, helper.singleImageUpload("subcategory"), controller.update)

module.exports = router;