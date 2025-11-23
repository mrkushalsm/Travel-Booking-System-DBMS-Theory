const { Router } = require('express');
const controller = require('../controllers/hotel.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { hotelValidator } = require('../validators/service.validators');

const router = Router();

router.get('/', controller.list);
router.post('/', auth('Admin', 'Staff'), hotelValidator, validate, controller.create);
router.put('/:id', auth('Admin', 'Staff'), hotelValidator, validate, controller.update);
router.delete('/:id', auth('Admin'), controller.remove);

module.exports = router;
