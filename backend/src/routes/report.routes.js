const { Router } = require('express');
const controller = require('../controllers/report.controller');
const auth = require('../middleware/auth');

const router = Router();

router.use(auth('Staff', 'Admin'));

router.get('/overview', controller.overview);
router.get('/sales', controller.sales);
router.get('/customers', controller.customers);
router.get('/trends', controller.trends);

module.exports = router;
