const pool = require('../config/db');

const listHotels = async (filters = {}) => {
  const clauses = [];
  const values = [];

  if (filters.location) {
    clauses.push('Location = ?');
    values.push(filters.location);
  }
  if (filters.maxPrice) {
    clauses.push('PricePerNight <= ?');
    values.push(filters.maxPrice);
  }
  if (filters.amenities) {
    filters.amenities.split(',').forEach((amenity) => {
      clauses.push('Amenities LIKE ?');
      values.push(`%${amenity.trim()}%`);
    });
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT * FROM Hotels ${where} ORDER BY PricePerNight ASC`, values);
  return rows;
};

const getHotel = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM Hotels WHERE HotelId = ?', [id]);
  return rows[0];
};

const createHotel = async (payload) => {
  const [result] = await pool.execute(
    `INSERT INTO Hotels (Name, Location, Amenities, RoomTypes, PricePerNight, TotalRooms, AvailableRooms)
     VALUES (?,?,?,?,?,?,?)`,
    [
      payload.name,
      payload.location,
      payload.amenities,
      payload.roomTypes,
      payload.pricePerNight,
      payload.totalRooms,
      payload.availableRooms ?? payload.totalRooms
    ]
  );
  return getHotel(result.insertId);
};

const updateHotel = async (id, payload) => {
  const map = {
    name: 'Name',
    location: 'Location',
    amenities: 'Amenities',
    roomTypes: 'RoomTypes',
    pricePerNight: 'PricePerNight',
    totalRooms: 'TotalRooms',
    availableRooms: 'AvailableRooms'
  };

  const clauses = [];
  const values = [];

  Object.entries(map).forEach(([key, column]) => {
    if (typeof payload[key] !== 'undefined') {
      clauses.push(`${column} = ?`);
      values.push(payload[key]);
    }
  });

  if (!clauses.length) return getHotel(id);

  values.push(id);
  await pool.execute(`UPDATE Hotels SET ${clauses.join(', ')} WHERE HotelId = ?`, values);
  return getHotel(id);
};

const deleteHotel = async (id) => {
  await pool.execute('DELETE FROM Hotels WHERE HotelId = ?', [id]);
  return { id };
};

module.exports = {
  listHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
};
