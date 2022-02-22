const mariadb = require("mariadb");
const { config } = require("./config/config");

const getConnection = () => {
  const pool = mariadb.createPool({
    host: config.dbHost,
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    port: config.dbPort,
  });
  return pool;
};

module.exports = { getConnection };
