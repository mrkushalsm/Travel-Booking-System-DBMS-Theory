const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const env = require('../config/env');
const userService = require('../services/user.service');
const { success } = require('../utils/apiResponse');

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role
    },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
};

const register = async (req, res, next) => {
  try {
    const existing = await userService.findByEmail(req.body.email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const user = await userService.createUser(req.body);
    const token = signToken(user);
    success(res, { user, token }, 'User registered', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await userService.findByEmail(req.body.email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    let valid = false;
    if (user.Password?.startsWith('$2')) {
      valid = await bcrypt.compare(req.body.password, user.Password);
    } else {
      valid = req.body.password === user.Password;
    }
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const mapped = userService.mapDbUser(user);
    const token = signToken(mapped);
    success(res, { user: mapped, token, expiresAt: dayjs().add(1, 'day').toISOString() }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await userService.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    success(res, { user: userService.mapDbUser(user) });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, me };
