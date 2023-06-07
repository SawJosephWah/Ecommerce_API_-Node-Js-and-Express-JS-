const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const validator = require('../validators/userValidator');
const commonValidator = require('../validators/commonValidator')

router.post('/store',validator.validateForm, controller.store);
router.post('/login', validator.validateLoginForm, controller.login);

router.post('/add-role-to-user', commonValidator.checkToken, commonValidator.validateSingleRole("Owner"), controller.addRoleToUser)
router.post('/remove-role-from-user', commonValidator.checkToken, commonValidator.validateSingleRole("Owner"), controller.removeRoleFromUser)

router.post('/add-permit-to-user', commonValidator.checkToken, commonValidator.validateSingleRole("Owner"), controller.addPermitToUser)

module.exports = router;