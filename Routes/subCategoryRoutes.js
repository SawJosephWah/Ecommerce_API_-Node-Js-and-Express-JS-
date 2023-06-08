const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const categoryValidator = require('../validators/CategoryValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/subCatController');

router.post('/store', commonValidator.checkToken, helper.singleImageUpload('subcategory'), controller.add);
router.get('/all', controller.all);

router.route('/:id')
    .get(commonValidator.checkObjectId, controller.get)
    .delete(commonValidator.checkObjectId, controller.deleteCategory)
    .patch(commonValidator.checkObjectId, helper.singleFileUpload, controller.update)

module.exports = router;