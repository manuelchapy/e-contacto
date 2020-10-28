const userCtrl = {};
const session = require('express-session');
const connection = require('../src/database');
const keygen = require("keygenerator");
var _

userCtrl.register = async(req,res) =>{

	console.log('FUNCIONO PAAAAAAAAAAA', req.body);
	//res.send('JELOU');
	const { id_business, id_ocupation, id_card_template, id_plan, email, passw, firstName 
	} = req.body;

	const sql= "SELECT * FROM `tbl_contacts` WHERE email = '"+email+"'";
	connection.query(sql, function(err, result, fie){
		if(err) throw err;
		console.log('pa ve el result', result);
		//const query = result[0]
		//res.json(query);
		//const queryJSON = query.map(item => item.toJSON())
		if(result.length <= 0){registrar()}
		if(result.length > 0){sendError()}
	})

	function sendError(){
		res.send('2') // Hay un email como este, pen
	}

	function registrar(){
		//nombre, correo, pass, con pass, 
			connection.query('INSERT INTO `tbl_contacts` SET?', {
			id_business: '1', 
			id_ocupation: '1', 
			id_card_template: '1', 
			id_plan : '1', 
			email, 
			passw, 
			first_name: firstName
		}, (err, result) => {
			if(err){
				console.log('no pudo completar el registro', err)
				//connection.end();
				res.send('3') //no pudo completar el registro
			}else{ 
				console.log('success', result)
				//connection.end();
				res.send('1') //SE REGISTRO
			}	
		});
	}

}

userCtrl.login = async(req,res) =>{

	console.log("DESDE LOGIN", req.body)
	const {email, passw} = req.body;
	console.log('email', email)
	const sql= "SELECT * FROM `tbl_contacts` WHERE email = '"+email+"'";
	connection.query(sql, function(err, result, fie){
		if(err){ throw err; res.send('3')};

		const query = result[0]
		//res.json(query);
		//const queryJSON = query.map(item => item.toJSON())
		if(result.length <= 0){sendError()}
		if(result.length > 0){
			const query = result[0];
			if(query.passw == passw){
				process(query)
			}else{
				sendError()
			}
		}

		
	})

	function process(query){
		const success = [];
		success.push({text: 'bienvenido ^^'})
		console.log('bienvenido usuario')
		console.log('The solution is: ', query)
		req.session.let = {
            sesion: keygen.session_id(),
            id: query.id_contact,
            email: query.email

        } 
        _ = query.id_contact;
        console.log('funciona, bienvenido')
        console.log('VARIABLES DE SESION DESDE LOGIN', req.session.let);
		res.send('1') //SE LOGUEO
	}

	function sendError(){
		const errors = [];
		errors.push({text: 'no puedes ingresar pa u.u, there is a problem'})
		console.log('el email no existe o no estás registrado o pusiste mal la clave')
		res.send('2') //no se logeo
	}
}



userCtrl.completeUser = async(req,res) =>{

	const { id_business, id_ocupation, id_card_template, id_plan, email, passw, firstName, 
	lastName, phone, phone_number2, phone_number3, address, city, state, zipCode, website, twitter, linkedin, facebook, 
	instagram } = req.body;

	console.log('variables de sesion', req.session.let);
	const sql = "UPDATE tbl_contacts SET last_name = '"+lastName+"', phone_number1 = '"+phone+"', phone_number2 = '"+phone_number2+"', phone_number3 = '"+phone_number3+"', address = '"+address+"', state = '"+state+"', website = '"+website+"', linkedin = '"+linkedin+"', facebook = '"+facebook+"', zip_code = '"+zipCode+"' WHERE id_contact = '"+_+"'";
	//console.log('ERRR LASTNAME', lastName)
	console.log("llegando desde flutter" ,req.body);
	
		connection.query(sql, function (error, results, fields) {
			console.log('LOS RESULT EN COMPLETE', results)
			console.log('LOS RESULT EN COMPLETE', error)
			if(error){
				res.send('2');
				console.log('ERROR', results);
			}
			if(results){
				res.send('1');
				console.log('Modifico pa', results);
			}
  		
	});

}

userCtrl.shareContact = async(req, res) =>{
	//const sql = "SELECT tbl_contacts.* FROM tbl_cards_shared INNER JOIN tbl_contacts ON tbl_cards_shared.id_contact_shared=tbl_contacts.id_contact WHERE tbl_cards_shared.id_contact='"+req.session.let.id+"'";
	const sql = "SELECT tbl_contacts.first_name,last_name,phone_number1 FROM tbl_cards_shared INNER JOIN tbl_contacts ON tbl_cards_shared.id_contact_shared=tbl_contacts.id_contact WHERE tbl_cards_shared.id_contact='"+_+"'";

	//console.log('ERRR LASTNAME', last_name);

	connection.query(sql, function(err, result, fie){
		if(err) throw err;
		//console.log('ESTE ES EL ID', req.session.let.id)
		console.log("ESTO ES DESDE shareContact",result[0]);
		console.log("RESULT",result);
		res.json(result);

	});



}


module.exports = userCtrl;
