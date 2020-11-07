const userCtrl = {};
const session = require('express-session');
const connection = require('../src/database');
const keygen = require("keygenerator");
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
var uniqid = require('uniqid');
const config = require('../src/config');


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
			const salt = 10;
			const passb = bcrypt.hashSync(passw, salt); 
			const qr = uniqid();

			connection.query('INSERT INTO `tbl_contacts` SET?', {
			id_business: '1', 
			id_ocupation: '1', 
			id_card_template: '1', 
			id_plan : '1', 
			email, 
			passw: passb, 
			first_name: firstName,
			tokenQr: qr
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

		//const sql= "SELECT * FROM `tbl_contacts` WHERE email = '"+email+"'";

	}

}

userCtrl.login = async(req,res) =>{

	console.log("DESDE LOGIN", req.body)
	const {email, passw} = req.body;
	console.log('email', email)
	const sql= "SELECT * FROM `tbl_contacts` WHERE email = '"+email+"'";
	//const sql= "SELECT * FROM tbl_contacts";
	connection.query(sql, function(err, result, fie){
		if(err){ 
			throw err; 
			const response = {
   			check:  "3"
 			};
			res.send(response)
		};

		const query = result[0]
		console.log(query);
		//const queryJSON = query.map(item => item.toJSON())
		if(result.length <= 0){sendError()}
		if(result.length > 0){
			const query = result[0];
			if(bcrypt.compareSync(passw, query.passw) && email == query.email){
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
		session.let = {
            sesion: keygen.session_id(),
            id: query.id_contact,
            email: query.email
        }

        console.log('el last name pilas', query.last_name);

        if(query.last_name == null){ 
        	const response = {
	   			check:  "4",
	   			qr: query.tokenQr,
	   			firstName: query.first_name
	 		};
	 		const token = jwt.sign(response, config.llave, {
	   			expiresIn: 60 * 60 * 24
	  		});

	  		response.token = token;

	  		console.log('EL TOKEN', token);

	        console.log('funciona, bienvenido pero pilas, tiene que llenar el formulario de usuario')
	        console.log('VARIABLES DE SESION DESDE LOGIN', session.let);
			res.send(response) //SE LOGUEO
        }else{if(query.last_name =! null){ 
	        const response = {
	   			check:  "1",
	   			qr: query.tokenQr,
	   			firstName: query.first_name
	 		};
	 		const token = jwt.sign(response, config.llave, {
	   			expiresIn: 60 * 60 * 24
	  		});

	  		response.token = token;

	  		console.log('EL TOKEN', token);

	        console.log('funciona, bienvenido')
	        console.log('VARIABLES DE SESION DESDE LOGIN', session.let);
			res.send(response) //SE LOGUEO
   		 }
   		}


	}

	function sendError(){
		const errors = [];
		errors.push({text: 'no puedes ingresar pa u.u, there is a problem'})
		console.log('el email no existe o no estás registrado o pusiste mal la clave')
		const response = {
   			check:  "2"
 		};
		res.send(response) //no se logeo
	}
}



userCtrl.completeUser = async(req,res) =>{

	const { id_business, id_ocupation, id_card_template, id_plan, email, passw, firstName, 
	lastName, phone, phone_number2, phone_number3, address, city, state, zipCode, website, twitter, linkedin, facebook, 
	instagram } = req.body;

	console.log('variables de sesion', session.let.id);
	const sql = "UPDATE tbl_contacts SET last_name = '"+lastName+"', phone_number1 = '"+phone+"', phone_number2 = '"+phone_number2+"', phone_number3 = '"+phone_number3+"', address = '"+address+"', state = '"+state+"', website = '"+website+"', linkedin = '"+linkedin+"', facebook = '"+facebook+"', zip_code = '"+zipCode+"' WHERE id_contact = '"+session.let.id+"'";
	//console.log('ERRR LASTNAME', lastName)
	console.log("llegando desde flutter" ,req.body);
	
		connection.query(sql, function (error, results, fields) {
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

userCtrl.contactList = async(req, res) =>{
	const sql = "SELECT tbl_contacts.* FROM tbl_cards_shared INNER JOIN tbl_contacts ON tbl_cards_shared.id_contact_shared=tbl_contacts.id_contact WHERE tbl_cards_shared.id_contact='"+session.let.id+"'";
	//const sql = "SELECT tbl_contacts.first_name,last_name,phone_number1 FROM tbl_cards_shared INNER JOIN tbl_contacts ON tbl_cards_shared.id_contact_shared=tbl_contacts.id_contact WHERE tbl_cards_shared.id_contact='"+_+"'";

	//console.log('ERRR LASTNAME', last_name);

	connection.query(sql, function(err, result, fie){
		if(err) throw err;
		//console.log('ESTE ES EL ID', req.session.let.id)
		console.log("ESTO ES DESDE contactList",result[0]);
		console.log("RESULT",result);
		res.json(result);

	});

}

userCtrl.addContact = async(req, res) =>{
	
	const { qr } = req.body;
	let query;

	const sql= "SELECT id_contact, first_name, last_name, phone_number1 FROM `tbl_contacts` WHERE tokenQr = '"+qr+"'";
	//const sql= "SELECT * FROM tbl_contacts";
	connection.query(sql, function(err, result, fie){
		if(err){ 
			throw err; 
			const perfil = {
						check: '3',
					}  
				res.send(perfil)
			console.log('error en DB')
		}else{
		if(result.length <= 0){sendError()}
			if(result.length > 0){
				query = result[0];
		 		findShare()
			}
		
		}
	});

	function sendError(){
		const perfil = {
			check: '2', //el usuario no existe
			}  
				res.send(perfil)
		console.log('el usuario no existe')
	}

	function findShare(){

		//foto, nombre, apellido, profesion, empresa.
		//const sql = "SELECT tbl_contacts.first_name,last_name,phone_number1 FROM
		const sql= "SELECT id_contact_shared FROM `tbl_cards_shared` WHERE id_contact_shared = '"+query.id_contact+"'";
		//const sql= "SELECT * FROM tbl_contacts";
		connection.query(sql, function(err, result, fie){
			if(err){ 
				throw err;
				const perfil = {
						check: '3',
					}  
				res.send(perfil)
				console.log('error en DB')
			}else{
			if(result.length <= 0){add()}
				if(result.length > 0){
					console.log('EL CONTACTO ADD', query);
					const perfil = {
						check: '4'
					} 
					res.send(perfil) //el contacto ya existe
					console.log('el contacto ya existe')
				}
			
			}
		});



	}

		
	function add(){
		console.log('EL QUERY', query)
		connection.query('INSERT INTO `tbl_cards_shared` SET?', {
			id_contact: session.let.id,
			id_contact_shared: query.id_contact
		}, (err, result) => {
			if(err){
				console.log('no pudo completar la tarea, intente de nuevo', err)
				res.send('3') //no pudo completar el registro
				console.log('error en DB')
			}else{ 
				console.log('success', result)
				console.log('EL CONTACTO ADD', query);
					const perfil = {
						check: '1', //se agrego usuario
						firstName: query.first_name,
						lastName: query.last_name,
						phone_number: query.phone_number1
					} 
				
				res.send(perfil) //SE AGREGO USUARIO
				console.log('se agrego usuario')
			}	
		});
	}
	//console.log('ERR BODY', qr)


	//console.log('en add contact')
}


module.exports = userCtrl;
