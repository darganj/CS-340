var mysql = require('mysql');
var pool = mysql.createPool({
	multipleStatements: true,
	connectionLimit : 10,
	host : 'classmysql.engr.oregonstate.edu',
	user : 'cs340_darganj',
	password : '3305',
	database : 'cs340_darganj'
});
module.exports.pool = pool;
