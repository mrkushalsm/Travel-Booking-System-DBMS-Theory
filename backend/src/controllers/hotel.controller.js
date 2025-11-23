const hotelService = require('../services/hotel.service');
const { success } = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const hotels = await hotelService.listHotels(req.query);
    success(res, { hotels });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const hotel = await hotelService.createHotel(req.body);
    success(res, { hotel }, 'Hotel created', 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const hotel = await hotelService.updateHotel(req.params.id, req.body);
    success(res, { hotel }, 'Hotel updated');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await hotelService.deleteHotel(req.params.id);
    success(res, {}, 'Hotel removed');
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update, remove };
