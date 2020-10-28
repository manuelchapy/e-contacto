const mysql = require('mysql');

//mysql connection

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'econtact_db',
	user: 'root',
	password: ''
})

connection.connect(function(error){
	if(error){
		throw error;
	}else{
		console.log('DB Connected')
	}
});

//connection.end();

module.exports = connection;