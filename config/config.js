require('dotenv').config();

const development = {
  username: process.env.RDS_ID,
  password: process.env.RDS_PW,
  database: 'SQL_project',
  host: process.env.RDS_URL,
  dialect: 'mysql',
};

const test = {
  username: 'root',
  password: null,
  database: 'database_test',
  host: '127.0.0.1',
  dialect: 'mysql',
};

const production = {
  username: 'root',
  password: null,
  database: 'database_production',
  host: '127.0.0.1',
  dialect: 'mysql',
};

module.exports = { development, test, production };
