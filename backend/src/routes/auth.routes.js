const { Router } = require('express');
const authController = require('../controllers/auth.controller');
const authValidators = require('../validators/auth.validators');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const router = Router();

router.post('/register', authValidators.registerValidator, validate, authController.register);
router.post('/login', authValidators.loginValidator, validate, authController.login);
router.get('/me', authMiddleware(), authController.me);

module.exports = router;
