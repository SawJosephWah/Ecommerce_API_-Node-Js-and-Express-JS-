const express = require('express');
const router = express.Router();
const commonValidator = require('../validators/commonValidator');
const helper = require('../utils/helper');
const controller = require('../controllers/deliveryController');

router.post('/store', commonValidator.checkToken, helper.singleImageUpload('delivery'), controller.add);
router.get('/all', controller.all);

router.route('/:id')
    .get(commonValidator.checkObjectId, controller.get)
    .delete(commonValidator.checkObjectId, controller.deleteDelivery)
    .patch(commonValidator.checkObjectId, helper.singleImageUpload("delivery"), controller.update)

module.exports = router;