const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const categoryValidator = require('../validators/CategoryValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/categoryController');

router.post('/store', commonValidator.checkToken, commonValidator.validateMultiplePermits(["Create_category"]), categoryValidator.categoryAlreadyExists, helper.singleFileUpload, controller.add);

router.get('/all', controller.all);
router.get('/:id', commonValidator.checkObjectId, controller.get);
router.delete('/:id', commonValidator.checkObjectId, controller.deleteCategory);

module.exports = router;