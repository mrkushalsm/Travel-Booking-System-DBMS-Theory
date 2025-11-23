const { body } = require('express-validator');

const paymentCreateValidator = [
  body('bookingId').isInt({ min: 1 }),
  body('amount').isFloat({ min: 0 }),
  body('paymentDate').isISO8601(),
  body('paymentMethod').isIn(['Card', 'NetBanking', 'UPI', 'Wallet']),
  body('status').optional().isIn(['Pending', 'Completed', 'Failed'])
];

const paymentUpdateValidator = [
  body('bookingId').optional().isInt({ min: 1 }),
  body('amount').optional().isFloat({ min: 0 }),
  body('paymentDate').optional().isISO8601(),
  body('paymentMethod').optional().isIn(['Card', 'NetBanking', 'UPI', 'Wallet']),
  body('status').optional().isIn(['Pending', 'Completed', 'Failed'])
];

module.exports = { paymentCreateValidator, paymentUpdateValidator };
