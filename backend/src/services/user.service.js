const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const mapDbUser = (row) => ({
  id: row.UserId,
  name: row.Name,
  email: row.Email,
  role: row.Role,
  contactNumber: row.ContactNumber,
  idProof: row.IDProof
});

const findByEmail = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM Users WHERE Email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM Users WHERE UserId = ?', [id]);
  return rows[0];
};

const listUsers = async () => {
  const [rows] = await pool.execute('SELECT * FROM Users ORDER BY Name ASC');
  return rows.map(mapDbUser);
};

const createUser = async ({ name, email, password, role = 'Customer', contactNumber, idProof }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await pool.execute(
    'INSERT INTO Users (Name, Email, Password, Role, ContactNumber, IDProof) VALUES (?,?,?,?,?,?)',
    [name, email, hashedPassword, role, contactNumber, idProof]
  );
  const created = await findById(result.insertId);
  return mapDbUser(created);
};

const updateUser = async (id, payload) => {
  const fields = [];
  const values = [];

  if (payload.name) {
    fields.push('Name = ?');
    values.push(payload.name);
  }
  if (payload.email) {
    fields.push('Email = ?');
    values.push(payload.email);
  }
  if (payload.password) {
    fields.push('Password = ?');
    values.push(await bcrypt.hash(payload.password, 10));
  }
  if (payload.role) {
    fields.push('Role = ?');
    values.push(payload.role);
  }
  if (payload.contactNumber) {
    fields.push('ContactNumber = ?');
    values.push(payload.contactNumber);
  }
  if (typeof payload.idProof !== 'undefined') {
    fields.push('IDProof = ?');
    values.push(payload.idProof);
  }

  if (!fields.length) {
    return mapDbUser(await findById(id));
  }

  values.push(id);
  await pool.execute(`UPDATE Users SET ${fields.join(', ')} WHERE UserId = ?`, values);
  return mapDbUser(await findById(id));
};

const deleteUser = async (id) => {
  await pool.execute('DELETE FROM Users WHERE UserId = ?', [id]);
  return { id };
};

module.exports = {
  findByEmail,
  findById,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  mapDbUser
};
