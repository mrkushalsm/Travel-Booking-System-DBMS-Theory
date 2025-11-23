const pool = require('../config/db');

const listPackages = async (filters = {}) => {
  const clauses = [];
  const values = [];

  if (filters.durationMin) {
    clauses.push('DurationDays >= ?');
    values.push(filters.durationMin);
  }
  if (filters.durationMax) {
    clauses.push('DurationDays <= ?');
    values.push(filters.durationMax);
  }
  if (filters.maxPrice) {
    clauses.push('Price <= ?');
    values.push(filters.maxPrice);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT * FROM TourPackages ${where} ORDER BY Price ASC`, values);
  return rows;
};

const getPackage = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM TourPackages WHERE PackageId = ?', [id]);
  return rows[0];
};

const createPackage = async (payload) => {
  const [result] = await pool.execute(
    `INSERT INTO TourPackages (Name, Description, Includes, DurationDays, Price, Availability)
     VALUES (?,?,?,?,?,?)`,
    [
      payload.name,
      payload.description,
      payload.includes,
      payload.durationDays,
      payload.price,
      payload.availability
    ]
  );
  return getPackage(result.insertId);
};

const updatePackage = async (id, payload) => {
  const map = {
    name: 'Name',
    description: 'Description',
    includes: 'Includes',
    durationDays: 'DurationDays',
    price: 'Price',
    availability: 'Availability'
  };

  const clauses = [];
  const values = [];

  Object.entries(map).forEach(([key, column]) => {
    if (typeof payload[key] !== 'undefined') {
      clauses.push(`${column} = ?`);
      values.push(payload[key]);
    }
  });

  if (!clauses.length) return getPackage(id);

  values.push(id);
  await pool.execute(`UPDATE TourPackages SET ${clauses.join(', ')} WHERE PackageId = ?`, values);
  return getPackage(id);
};

const deletePackage = async (id) => {
  await pool.execute('DELETE FROM TourPackages WHERE PackageId = ?', [id]);
  return { id };
};

module.exports = {
  listPackages,
  getPackage,
  createPackage,
  updatePackage,
  deletePackage
};
