const { Router } = require('express');
const controller = require('../controllers/payment.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { paymentCreateValidator, paymentUpdateValidator } = require('../validators/payment.validators');

const router = Router();

router.use(auth('Staff', 'Admin'));

router.get('/', controller.list);
router.post('/', paymentCreateValidator, validate, controller.create);
router.put('/:id', paymentUpdateValidator, validate, controller.update);

module.exports = router;
