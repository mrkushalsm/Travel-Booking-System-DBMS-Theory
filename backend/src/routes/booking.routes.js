const { Router } = require('express');
const controller = require('../controllers/booking.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { bookingCreateValidator, bookingUpdateValidator, bookingStatusValidator } = require('../validators/booking.validators');

const router = Router();

router.use(auth('Customer', 'Staff', 'Admin'));

router.get('/', controller.list);
router.post('/', bookingCreateValidator, validate, controller.create);
router.put('/:id', bookingUpdateValidator, validate, controller.update);
router.patch('/:id/status', bookingStatusValidator, validate, controller.updateStatus);
router.post('/:id/approve', controller.approve);
router.post('/:id/cancel', controller.cancel);

module.exports = router;
