var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'fintech210222'
});
 
connection.connect();
 
connection.query('SELECT * from user', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});

connection.end();