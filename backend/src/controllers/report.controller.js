const reportService = require('../services/report.service');
const { success } = require('../utils/apiResponse');

const overview = async (_req, res, next) => {
  try {
    const data = await reportService.getOverview();
    success(res, data);
  } catch (error) {
    next(error);
  }
};

const sales = async (_req, res, next) => {
  try {
    const data = await reportService.getSalesBreakdown();
    success(res, { breakdown: data });
  } catch (error) {
    next(error);
  }
};

const customers = async (_req, res, next) => {
  try {
    const data = await reportService.getTopCustomers();
    success(res, { customers: data });
  } catch (error) {
    next(error);
  }
};

const trends = async (_req, res, next) => {
  try {
    const data = await reportService.getBookingTrends();
    success(res, { trends: data });
  } catch (error) {
    next(error);
  }
};

module.exports = { overview, sales, customers, trends };
