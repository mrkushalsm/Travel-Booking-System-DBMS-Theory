const flightService = require('../services/flight.service');
const { success } = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const flights = await flightService.listFlights(req.query);
    success(res, { flights });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const flight = await flightService.createFlight(req.body);
    success(res, { flight }, 'Flight created', 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const flight = await flightService.updateFlight(req.params.id, req.body);
    success(res, { flight }, 'Flight updated');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await flightService.deleteFlight(req.params.id);
    success(res, {}, 'Flight removed');
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update, remove };
