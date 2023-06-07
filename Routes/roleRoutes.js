const express = require('express');
const router = express.Router();
const controller = require('../controllers/roleController');
const validator = require('../validators/RoleValidator')
const commonValidator = require('../validators/commonValidator')

router.get('/all', commonValidator.checkToken,commonValidator.validateMultipleRoles(["Owner","Manager"]), controller.allRoles);
router.post('/store', validator.roleAlreadyExists, validator.validateForm, controller.store);
router.route('/:id')
  .get(commonValidator.checkObjectId, controller.get)
  .patch(commonValidator.checkObjectId, controller.update)
  .delete(commonValidator.checkObjectId, controller.deleteRole)

router.post('/add/permit', validator.chackRoleIdAndPermitId, controller.addPermitToRole)
router.post('/remove/permit', validator.chackRoleIdAndPermitId, controller.removePermitFromRole)

router.get('/about', (req, res) => {
  res.send('About page');
});

module.exports = router;
