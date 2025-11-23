const { Router } = require('express');
const controller = require('../controllers/user.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { profileUpdateValidator } = require('../validators/auth.validators');

const router = Router();

router.get('/', auth('Admin', 'Staff'), controller.list);
router.get('/:id', auth('Admin', 'Staff'), controller.detail);
router.put('/:id', auth('Admin', 'Staff'), profileUpdateValidator, validate, controller.update);
router.delete('/:id', auth('Admin'), controller.remove);

module.exports = router;
