const { body } = require('express-validator');

const flightValidator = [
  body('airline').notEmpty(),
  body('source').notEmpty(),
  body('destination').notEmpty(),
  body('departureDate').isISO8601(),
  body('departureTime').notEmpty(),
  body('arrivalDate').isISO8601(),
  body('arrivalTime').notEmpty(),
  body('price').isFloat({ min: 0 }),
  body('totalSeats').isInt({ min: 1 })
];

const hotelValidator = [
  body('name').notEmpty(),
  body('location').notEmpty(),
  body('amenities').notEmpty(),
  body('roomTypes').notEmpty(),
  body('pricePerNight').isFloat({ min: 0 }),
  body('totalRooms').isInt({ min: 1 })
];

const packageValidator = [
  body('name').notEmpty(),
  body('description').notEmpty(),
  body('includes').notEmpty(),
  body('durationDays').isInt({ min: 1 }),
  body('price').isFloat({ min: 0 }),
  body('availability').isInt({ min: 0 })
];

module.exports = {
  flightValidator,
  hotelValidator,
  packageValidator
};
