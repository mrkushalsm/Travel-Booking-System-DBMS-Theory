const app = require('./app');
const env = require('./config/env');

const start = () => {
  app.listen(env.port, () => {
    console.log(`Travel Agency API running on port ${env.port}`);
  });
};

start();
