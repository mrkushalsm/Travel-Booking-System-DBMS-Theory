const pool = require('../config/db');

const getOverview = async () => {
  const [[userStats]] = await pool.execute(
    'SELECT COUNT(*) AS totalUsers FROM Users'
  );
  const [[bookingStats]] = await pool.execute(
    `SELECT COUNT(*) AS totalBookings,
            SUM(CASE WHEN Status = 'Confirmed' THEN 1 ELSE 0 END) AS confirmed,
            SUM(CASE WHEN Status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled
     FROM Bookings`
  );
  const [[revenueStats]] = await pool.execute(
    `SELECT COALESCE(SUM(Amount),0) AS revenue FROM Payments WHERE Status = 'Completed'`
  );
  return { ...userStats, ...bookingStats, ...revenueStats };
};

const getSalesBreakdown = async () => {
  const [rows] = await pool.execute(
    `SELECT b.BookingType,
            COUNT(*) AS bookings,
            COALESCE(SUM(p.Amount), 0) AS revenue
     FROM Bookings b
     LEFT JOIN Payments p ON b.BookingId = p.BookingId AND p.Status = 'Completed'
     GROUP BY b.BookingType`
  );
  return rows;
};

const getTopCustomers = async () => {
  const [rows] = await pool.execute(
    `SELECT u.Name, u.Email, COUNT(b.BookingId) AS bookings, COALESCE(SUM(p.Amount), 0) AS spend
     FROM Users u
     JOIN Bookings b ON u.UserId = b.UserId
     LEFT JOIN Payments p ON b.BookingId = p.BookingId AND p.Status = 'Completed'
     GROUP BY u.UserId
     ORDER BY spend DESC
     LIMIT 5`
  );
  return rows;
};

const getBookingTrends = async () => {
  const [rows] = await pool.execute(
    `SELECT DATE_FORMAT(BookingDate, '%Y-%m') AS month,
            COUNT(*) AS bookings
     FROM Bookings
     GROUP BY DATE_FORMAT(BookingDate, '%Y-%m')
     ORDER BY month`
  );
  return rows;
};

module.exports = {
  getOverview,
  getSalesBreakdown,
  getTopCustomers,
  getBookingTrends
};
