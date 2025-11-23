const pool = require('../config/db');

const listFlights = async (filters = {}) => {
  const conditions = [];
  const values = [];

  if (filters.source) {
    conditions.push('Source = ?');
    values.push(filters.source);
  }
  if (filters.destination) {
    conditions.push('Destination = ?');
    values.push(filters.destination);
  }
  if (filters.airline) {
    conditions.push('Airline = ?');
    values.push(filters.airline);
  }
  if (filters.fromDate && filters.toDate) {
    conditions.push('DepartureDate BETWEEN ? AND ?');
    values.push(filters.fromDate, filters.toDate);
  } else if (filters.fromDate) {
    conditions.push('DepartureDate >= ?');
    values.push(filters.fromDate);
  } else if (filters.toDate) {
    conditions.push('DepartureDate <= ?');
    values.push(filters.toDate);
  }
  if (filters.maxPrice) {
    conditions.push('Price <= ?');
    values.push(filters.maxPrice);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT * FROM Flights ${where} ORDER BY DepartureDate, DepartureTime`, values);
  return rows;
};

const createFlight = async (payload) => {
  const [result] = await pool.execute(
    `INSERT INTO Flights (Airline, Source, Destination, DepartureDate, DepartureTime, ArrivalDate, ArrivalTime, Price, TotalSeats, AvailableSeats)
     VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [
      payload.airline,
      payload.source,
      payload.destination,
      payload.departureDate,
      payload.departureTime,
      payload.arrivalDate,
      payload.arrivalTime,
      payload.price,
      payload.totalSeats,
      payload.availableSeats ?? payload.totalSeats
    ]
  );
  return getFlight(result.insertId);
};

const getFlight = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM Flights WHERE FlightId = ?', [id]);
  return rows[0];
};

const updateFlight = async (id, payload) => {
  const fields = [];
  const values = [];
  const map = {
    airline: 'Airline',
    source: 'Source',
    destination: 'Destination',
    departureDate: 'DepartureDate',
    departureTime: 'DepartureTime',
    arrivalDate: 'ArrivalDate',
    arrivalTime: 'ArrivalTime',
    price: 'Price',
    totalSeats: 'TotalSeats',
    availableSeats: 'AvailableSeats'
  };

  Object.entries(map).forEach(([key, column]) => {
    if (typeof payload[key] !== 'undefined') {
      fields.push(`${column} = ?`);
      values.push(payload[key]);
    }
  });

  if (!fields.length) return getFlight(id);

  values.push(id);
  await pool.execute(`UPDATE Flights SET ${fields.join(', ')} WHERE FlightId = ?`, values);
  return getFlight(id);
};

const deleteFlight = async (id) => {
  await pool.execute('DELETE FROM Flights WHERE FlightId = ?', [id]);
  return { id };
};

module.exports = {
  listFlights,
  createFlight,
  getFlight,
  updateFlight,
  deleteFlight
};
