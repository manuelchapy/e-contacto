const mysql = require('mysql');

//mysql connection

const connection = mysql.createConnection({
	host: '74.208.147.248',
	database: 'db_econtactapp',
	user: 'dbusr_eca',
	password: 'Fa5#e6r7'
})

connection.connect(function(error){
	if(error){
		throw error;
	}else{
		console.log('DB Connected')
	}
});

module.exports = connection;