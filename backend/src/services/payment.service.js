const pool = require('../config/db');

const createNotFoundError = () => {
  const error = new Error('Payment not found');
  error.statusCode = 404;
  return error;
};

const listPayments = async (filters = {}) => {
  const clauses = [];
  const values = [];

  if (filters.bookingId) {
    clauses.push('BookingId = ?');
    values.push(filters.bookingId);
  }
  if (filters.status) {
    clauses.push('Status = ?');
    values.push(filters.status);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const [rows] = await pool.execute(`SELECT * FROM Payments ${where} ORDER BY PaymentDate DESC`, values);
  return rows;
};

const getPayment = async (id) => {
  const [rows] = await pool.execute('SELECT * FROM Payments WHERE PaymentId = ?', [id]);
  return rows[0];
};

const createPayment = async (payload) => {
  const [result] = await pool.execute(
    `INSERT INTO Payments (BookingId, Amount, PaymentDate, PaymentMethod, Status)
     VALUES (?,?,?,?,?)`,
    [
      payload.bookingId,
      payload.amount,
      payload.paymentDate,
      payload.paymentMethod,
      payload.status || 'Completed'
    ]
  );
  return getPayment(result.insertId);
};

const updatePayment = async (id, payload) => {
  const map = {
    bookingId: 'BookingId',
    amount: 'Amount',
    paymentDate: 'PaymentDate',
    paymentMethod: 'PaymentMethod',
    status: 'Status'
  };

  const clauses = [];
  const values = [];

  Object.entries(map).forEach(([key, column]) => {
    if (typeof payload[key] !== 'undefined') {
      clauses.push(`${column} = ?`);
      values.push(payload[key]);
    }
  });

  if (!clauses.length) return getPayment(id);

  values.push(id);
  await pool.execute(`UPDATE Payments SET ${clauses.join(', ')} WHERE PaymentId = ?`, values);
  return getPayment(id);
};

const completePayment = async (id) => {
  const [rows] = await pool.execute('SELECT MarkPaymentCompleted(?) AS outcome', [id]);
  const outcome = rows?.[0]?.outcome ?? rows?.[0]?.MarkPaymentCompleted;

  if (!outcome || outcome === 'NOT_FOUND') {
    throw createNotFoundError();
  }

  const payment = await getPayment(id);
  return { payment, outcome };
};

module.exports = {
  listPayments,
  getPayment,
  createPayment,
  updatePayment,
  completePayment
};
