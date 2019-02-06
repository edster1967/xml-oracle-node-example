const dbconfig = {
    user: process.env.ORACLE_DB_USERNAME,
    password: process.env.ORACLE_DB_PASSWORD,
    connectString: process.env.ORACLE_DB_CONNECTION_STRING,
    poolMax: 10,
    poolMin: 0,
    poolIncrement: 1,
    poolPingInterval: 5,
    poolTimeout: 5,
    queueTimeout: 0
  };
  
  module.exports.dbconfig = dbconfig;