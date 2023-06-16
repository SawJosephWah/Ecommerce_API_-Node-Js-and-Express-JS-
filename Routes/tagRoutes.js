const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/tagController');

router.post('/store', commonValidator.checkToken, helper.singleImageUpload('tag'), controller.add);
router.get('/all', controller.all);

router.route('/:id')
    .get(commonValidator.checkObjectId, controller.get)
    .delete(commonValidator.checkObjectId, controller.deleteTag)
    .patch(commonValidator.checkObjectId, helper.singleImageUpload("tag"), controller.update)

module.exports = router;