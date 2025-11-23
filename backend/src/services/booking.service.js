const pool = require('../config/db');

const serviceTables = {
  Flight: {
    table: 'Flights',
    id: 'FlightId',
    availability: 'AvailableSeats'
  },
  Hotel: {
    table: 'Hotels',
    id: 'HotelId',
    availability: 'AvailableRooms'
  },
  Package: {
    table: 'TourPackages',
    id: 'PackageId',
    availability: 'Availability'
  }
};

const checkAvailability = async (conn, bookingType, serviceId, travellers) => {
  const meta = serviceTables[bookingType];
  const [rows] = await conn.execute(
    `SELECT ${meta.availability} AS available FROM ${meta.table} WHERE ${meta.id} = ? FOR UPDATE`,
    [serviceId]
  );
  if (!rows.length) {
    throw new Error(`${bookingType} not found`);
  }
  if (rows[0].available < travellers) {
    throw new Error(`Not enough availability. Remaining: ${rows[0].available}`);
  }
};

const reduceAvailability = async (conn, bookingType, serviceId, travellers) => {
  const meta = serviceTables[bookingType];
  await conn.execute(
    `UPDATE ${meta.table} SET ${meta.availability} = ${meta.availability} - ? WHERE ${meta.id} = ?`,
    [travellers, serviceId]
  );
};

const releaseAvailability = async (conn, bookingType, serviceId, travellers) => {
  const meta = serviceTables[bookingType];
  await conn.execute(
    `UPDATE ${meta.table} SET ${meta.availability} = ${meta.availability} + ? WHERE ${meta.id} = ?`,
    [travellers, serviceId]
  );
};

const listBookings = async (filters = {}) => {
  const clauses = [];
  const values = [];

  if (filters.userId) {
    clauses.push('UserId = ?');
    values.push(filters.userId);
  }
  if (filters.status) {
    clauses.push('Status = ?');
    values.push(filters.status);
  }
  if (filters.bookingType) {
    clauses.push('BookingType = ?');
    values.push(filters.bookingType);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await pool.execute(
    `SELECT b.*, COALESCE(f.Airline, h.Name, p.Name) AS ServiceName
     FROM Bookings b
     LEFT JOIN Flights f ON b.BookingType = 'Flight' AND b.ServiceId = f.FlightId
     LEFT JOIN Hotels h ON b.BookingType = 'Hotel' AND b.ServiceId = h.HotelId
     LEFT JOIN TourPackages p ON b.BookingType = 'Package' AND b.ServiceId = p.PackageId
     ${where}
     ORDER BY b.BookingDate DESC`,
    values
  );
  return rows;
};

const getBooking = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM Bookings WHERE BookingId = ?', [id]);
  return rows[0];
};

const createBooking = async (payload) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await checkAvailability(conn, payload.bookingType, payload.serviceId, payload.numberOfTravellers);

    const [result] = await conn.execute(
      `INSERT INTO Bookings (UserId, BookingType, ServiceId, BookingDate, TravelDate, Status, NumberOfTravellers)
       VALUES (?,?,?,?,?,?,?)`,
      [
        payload.userId,
        payload.bookingType,
        payload.serviceId,
        payload.bookingDate,
        payload.travelDate,
        payload.status || 'Pending',
        payload.numberOfTravellers
      ]
    );

    await conn.commit();
    return getBooking(result.insertId);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const updateBookingStatus = async (id, status) => {
  await pool.execute('UPDATE Bookings SET Status = ? WHERE BookingId = ?', [status, id]);
  return getBooking(id);
};

const updateBooking = async (id, payload) => {
  const booking = await getBooking(id);
  if (!booking) throw new Error('Booking not found');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    if (
      payload.numberOfTravellers &&
      payload.numberOfTravellers !== booking.NumberOfTravellers
    ) {
      const diff = payload.numberOfTravellers - booking.NumberOfTravellers;
      if (diff > 0) {
        await checkAvailability(conn, booking.BookingType, booking.ServiceId, diff);
        await reduceAvailability(conn, booking.BookingType, booking.ServiceId, diff);
      } else {
        await releaseAvailability(conn, booking.BookingType, booking.ServiceId, Math.abs(diff));
      }
    }

    const fields = [];
    const values = [];

    const map = {
      userId: 'UserId',
      bookingType: 'BookingType',
      serviceId: 'ServiceId',
      bookingDate: 'BookingDate',
      travelDate: 'TravelDate',
      status: 'Status',
      numberOfTravellers: 'NumberOfTravellers'
    };

    Object.entries(map).forEach(([key, column]) => {
      if (typeof payload[key] !== 'undefined') {
        fields.push(`${column} = ?`);
        values.push(payload[key]);
      }
    });

    if (fields.length) {
      values.push(id);
      await conn.execute(`UPDATE Bookings SET ${fields.join(', ')} WHERE BookingId = ?`, values);
    }

    await conn.commit();
    return getBooking(id);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

const cancelBooking = async (id) => {
  const booking = await getBooking(id);
  if (!booking) throw new Error('Booking not found');
  if (booking.Status === 'Cancelled') return booking;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await releaseAvailability(
      conn,
      booking.BookingType,
      booking.ServiceId,
      booking.NumberOfTravellers
    );
    await conn.execute('UPDATE Bookings SET Status = ? WHERE BookingId = ?', ['Cancelled', id]);
    await conn.commit();
    return getBooking(id);
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
};

module.exports = {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  updateBookingStatus,
  cancelBooking
};
