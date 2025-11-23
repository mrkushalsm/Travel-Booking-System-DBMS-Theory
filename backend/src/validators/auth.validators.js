const { body } = require('express-validator');

const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  body('role').optional().isIn(['Customer', 'Staff', 'Admin']),
  body('contactNumber').optional().isLength({ min: 10, max: 10 })
];

const loginValidator = [
  body('email').isEmail(),
  body('password').notEmpty()
];

const profileUpdateValidator = [
  body('name').optional().notEmpty(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  body('role').optional().isIn(['Customer', 'Staff', 'Admin']),
  body('contactNumber').optional().isLength({ min: 10, max: 10 })
];

module.exports = {
  registerValidator,
  loginValidator,
  profileUpdateValidator
};
