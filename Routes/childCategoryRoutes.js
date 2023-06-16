const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/childCatController');

router.post('/store', commonValidator.checkToken, helper.singleImageUpload('childcategory'), controller.add);
router.get('/all', controller.all);

router.route('/:id')
    .get(commonValidator.checkObjectId, controller.get)
    .delete(commonValidator.checkObjectId, controller.deleteChildCategory)
    .patch(commonValidator.checkObjectId, helper.singleImageUpload("childcategory"), controller.update)

module.exports = router;