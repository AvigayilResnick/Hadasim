const mysql = require('mysql2');


const pull = mysql.createPull({
  host: 'localhost',
  user: 'root',
  database: 'store_management',
  port: 3306,
  password: 'Gayil!3716',
}).promise();

module.exports = pull;
