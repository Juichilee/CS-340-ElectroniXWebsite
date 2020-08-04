var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_martdarc',
  password        : '6302',
  database        : 'cs340_martdarc',
  multipleStatements: true
});

module.exports.pool = pool;
