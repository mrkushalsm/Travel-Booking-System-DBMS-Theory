const bookingService = require('../services/booking.service');
const { success } = require('../utils/apiResponse');

const ensureOwnership = async (req, bookingId) => {
  if (!req.user || req.user.role !== 'Customer') return null;
  const booking = await bookingService.getBooking(bookingId);
  if (!booking) return null;
  if (booking.UserId !== req.user.id) {
    const error = new Error('Not authorized for this booking');
    error.statusCode = 403;
    throw error;
  }
  return booking;
};

const list = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    if (req.user?.role === 'Customer') {
      filters.userId = req.user.id;
    }
    const bookings = await bookingService.listBookings(filters);
    success(res, { bookings });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (req.user?.role === 'Customer') {
      payload.userId = req.user.id;
    }
    if (!payload.userId) {
      return res.status(400).json({ success: false, message: 'userId is required for staff/admin bookings' });
    }
    const booking = await bookingService.createBooking(payload);
    success(res, { booking }, 'Booking created', 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    await ensureOwnership(req, req.params.id);
    const booking = await bookingService.updateBooking(req.params.id, req.body);
    success(res, { booking }, 'Booking updated');
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    await ensureOwnership(req, req.params.id);
    const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
    success(res, { booking }, 'Status updated');
  } catch (error) {
    next(error);
  }
};

const approve = async (req, res, next) => {
  try {
    if (!['Staff', 'Admin'].includes(req.user?.role)) {
      return res.status(403).json({ success: false, message: 'Only staff can approve bookings' });
    }
    const booking = await bookingService.updateBookingStatus(req.params.id, 'Confirmed');
    success(res, { booking }, 'Booking approved');
  } catch (error) {
    next(error);
  }
};

const cancel = async (req, res, next) => {
  try {
    await ensureOwnership(req, req.params.id);
    const booking = await bookingService.cancelBooking(req.params.id);
    success(res, { booking }, 'Booking cancelled');
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update, updateStatus, approve, cancel };
