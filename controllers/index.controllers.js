const indexCtrl = {};
const session = require('express-session');
const connection = require('../src/database');

indexCtrl.getIndex = async(req,res) =>{
	connection.query('SELECT * FROM `tbl_contacts` WHERE 1', function(err, result, fie){
		if(err) throw error;

		const query = result[0]
		res.json(query);
		//const queryJSON = query.map(item => item.toJSON());
		console.log('The solution is: ', query)
	})
}



module.exports = indexCtrl;