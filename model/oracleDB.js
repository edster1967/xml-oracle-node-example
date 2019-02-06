var oracledb = require("oracledb");
var edDbConfig = require("../config/dbConfig");
let connection = null;
var SQL_CONSTANTS = require("../resources/sql.json");
var testInputConstants = require("../resources/testInput.json");
var rowCount = 0;

function getPricingFromDbTake2(itemNumber, catalogId) {
  
  var sql = SQL_CONSTANTS.pricing_sql;
    
  console.log("SQL attempted:  " + sql);
  return new Promise(async function (resolve, reject) {
    let conn; // Declared here for scoping purposes.
    try {
      conn = await oracledb.getConnection(edDbConfig.dbconfig);
      console.log('Connected to database');
      let result = await conn.execute(
        sql,
        [testInputConstants.itemNumber, testInputConstants.catalogId],
        {
          outFormat: oracledb.OBJECT
        }
      );
      console.log('Query executed-', result.rows[0]);
      resolve(result.rows[0]);
    }
    catch (err) {
      console.log('Error occurred', err);
      reject(err);
    }
    finally {
      // If conn assignment worked, need to close.
      if (conn) {
        try {
          await conn.close();
          console.log('Connection closed');
        } catch (err) {
          console.log('Error closing connection', err);
        }
      }
    }

  });
}

module.exports.getPricingFromDbTake2 = getPricingFromDbTake2;


