const express = require('express');
const router = express.Router();
const controller = require('../controllers/permitController');
const validator = require('../validators/PermitValidator')
const commonValidator = require('../validators/commonValidator')

router.get('/all',commonValidator.checkToken , controller.allPermits);
router.post('/store',validator.permitAlreadyExists,validator.validateForm, controller.store);

router.route('/:id')
    .get(commonValidator.checkObjectId,controller.get)
    .patch(commonValidator.checkObjectId,controller.update)
    .delete(commonValidator.checkObjectId,controller.deletePermit)

router.get('/about', (req, res) => {
  res.send('About page');
});

module.exports = router;
