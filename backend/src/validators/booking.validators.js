const { body } = require('express-validator');

const bookingCreateValidator = [
   body('userId').optional().isInt({ min: 1 }),
  body('bookingType').isIn(['Flight', 'Hotel', 'Package']),
  body('serviceId').isInt({ min: 1 }),
  body('bookingDate').isISO8601(),
  body('travelDate').isISO8601(),
  body('numberOfTravellers').isInt({ min: 1 })
];

const bookingUpdateValidator = [
  body('userId').optional().isInt({ min: 1 }),
  body('bookingType').optional().isIn(['Flight', 'Hotel', 'Package']),
  body('serviceId').optional().isInt({ min: 1 }),
  body('bookingDate').optional().isISO8601(),
  body('travelDate').optional().isISO8601(),
  body('status').optional().isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed']),
  body('numberOfTravellers').optional().isInt({ min: 1 })
];

const bookingStatusValidator = [
  body('status').isIn(['Pending', 'Confirmed', 'Cancelled', 'Completed'])
];

module.exports = {
  bookingCreateValidator,
  bookingUpdateValidator,
  bookingStatusValidator
};
