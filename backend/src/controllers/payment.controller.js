const paymentService = require('../services/payment.service');
const { success } = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const payments = await paymentService.listPayments(req.query);
    success(res, { payments });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const payment = await paymentService.createPayment(req.body);
    success(res, { payment }, 'Payment recorded', 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const payment = await paymentService.updatePayment(req.params.id, req.body);
    success(res, { payment }, 'Payment updated');
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update };
