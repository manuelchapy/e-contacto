const mysql = require('mysql');

//mysql connectionn

/*const connection = mysql.createConnection({
	host: '74.208.147.248',
	database: 'db_econtactapp',
	user: 'dbusr_eca',
	password: 'Fa5#e6r7'
})*/

//local host

const connection = mysql.createConnection({
	host: 'localhost',
	database: 'econtact_db',
	user: 'root',
	password: ''
})
//
connection.connect(function(error){
	if(error){
		throw error;
	}else{
		console.log('DB Connected')
	}
});

module.exports = connection;