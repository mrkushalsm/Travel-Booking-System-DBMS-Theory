const packageService = require('../services/package.service');
const { success } = require('../utils/apiResponse');

const list = async (req, res, next) => {
  try {
    const packages = await packageService.listPackages(req.query);
    success(res, { packages });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const pkg = await packageService.createPackage(req.body);
    success(res, { package: pkg }, 'Package created', 201);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const pkg = await packageService.updatePackage(req.params.id, req.body);
    success(res, { package: pkg }, 'Package updated');
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await packageService.deletePackage(req.params.id);
    success(res, {}, 'Package removed');
  } catch (error) {
    next(error);
  }
};

module.exports = { list, create, update, remove };
