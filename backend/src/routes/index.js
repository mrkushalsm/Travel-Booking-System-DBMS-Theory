const { Router } = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const flightRoutes = require('./flight.routes');
const hotelRoutes = require('./hotel.routes');
const packageRoutes = require('./package.routes');
const bookingRoutes = require('./booking.routes');
const paymentRoutes = require('./payment.routes');
const reportRoutes = require('./report.routes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/flights', flightRoutes);
router.use('/hotels', hotelRoutes);
router.use('/packages', packageRoutes);
router.use('/bookings', bookingRoutes);
router.use('/payments', paymentRoutes);
router.use('/reports', reportRoutes);

module.exports = router;
