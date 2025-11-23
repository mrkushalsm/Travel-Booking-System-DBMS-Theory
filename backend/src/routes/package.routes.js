const { Router } = require('express');
const controller = require('../controllers/package.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { packageValidator } = require('../validators/service.validators');

const router = Router();

router.get('/', controller.list);
router.post('/', auth('Admin', 'Staff'), packageValidator, validate, controller.create);
router.put('/:id', auth('Admin', 'Staff'), packageValidator, validate, controller.update);
router.delete('/:id', auth('Admin'), controller.remove);

module.exports = router;
