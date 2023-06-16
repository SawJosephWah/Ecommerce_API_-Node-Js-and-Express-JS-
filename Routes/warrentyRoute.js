const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/warrentyController');

router.post('/store', commonValidator.checkToken, helper.singleImageUpload('warrenty'), controller.add);
router.get('/all', controller.all);

router.route('/:id')
    .get(commonValidator.checkObjectId, controller.get)
    .delete(commonValidator.checkObjectId, controller.deleteWarrenty)
    .patch(commonValidator.checkObjectId, helper.singleImageUpload("warrenty"), controller.update)

module.exports = router;