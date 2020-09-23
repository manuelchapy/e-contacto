const indexCtrl = {};
const session = require('express-session');

indexCtrl.getIndex = async(req,res) =>{
	res.send('Hola Mundo')
}



module.exports = indexCtrl;