const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'TravelAgencyDB'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'travel_agency_secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  }
};

module.exports = env;
