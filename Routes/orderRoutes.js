const express = require('express');
const router = express.Router();
const controller = require('../controllers/orderController');
const commonValidator = require('../validators/commonValidator');

router.post('/store', commonValidator.checkToken, controller.store);
router.get('/get-user-orders/:id', commonValidator.checkObjectId,controller.getUserOrder);

module.exports = router;
