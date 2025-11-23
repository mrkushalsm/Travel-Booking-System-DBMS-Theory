const userService = require('../services/user.service');
const { success } = require('../utils/apiResponse');

const list = async (_req, res, next) => {
  try {
    const users = await userService.listUsers();
    success(res, { users });
  } catch (error) {
    next(error);
  }
};

const detail = async (req, res, next) => {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    success(res, { user: userService.mapDbUser(user) });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    success(res, { user });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    success(res, {}, 'User deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { list, detail, update, remove };
