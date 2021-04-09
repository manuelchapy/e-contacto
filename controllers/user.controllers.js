const userCtrl = {};
const session = require('express-session');
const connection = require('../src/database');
const keygen = require("keygenerator");
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqid = require('uniqid');
const config = require('../src/config');
const http = require('http'); 
const fs = require ("fs");
const path = require('path');
const uniqueKeygen = require('unique-keygen');
const cloudinary = require('cloudinary').v2;
const request = require('request');
const axios = require('axios');
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINAY_API_SECRET

});


userCtrl.register = async(req,res) =>{

	console.log('FUNCIONO PAAAAAAAAAAA', req.body);
	//res.send('JELOU');
	const { id_business, id_ocupation, id_card_template, id_plan, email, passw, first_name 
	} = req.body;

	const sql= "SELECT * FROM `tbl_contacts` WHERE email = '"+email+"'";
	connection.query(sql, function(err, result, fie){
		if(err) {
				console.log('error en la conexion intente de nuevo', err)
				//connection.end();
				res.send('3') //no pudo completar el registro
			}
		console.log('pa ve el result', result);
		//const query = result[0]
		//res.json(query);
		//const queryJSON = query.map(item => item.toJSON())
		if(result.length <= 0){registrar()}
		if(result.length > 0){sendError()}
	})

	function sendError(){
		console.log('YA HAY UN MAIL')
		res.send('2') // Hay un email como este, pen
	}

	function registrar(){
		//nombre, correo, pass, con pass,
			console.log('PASO A REGISTRAR')
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
			first_name: first_name,
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
   			check:  "3" //error de conexion con la DB
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

	 		//console.log('EL QR DESDE EL QUERY!!!!!!!!!!', query.tokenQr)
	  		response.token = token;
	  		session.let = {
	            sesion: token,
	            id: query.id_contact,
	            email: query.email,
	            qr: query.tokenQr
       		 }
       		 console.log('EL QR DESDE LA SESION!!!!!!!!!', session.let.qr)

	  		//console.log('EL TOKEN', token);

	        console.log('funciona, bienvenido pero pilas, tiene que llenar el formulario de usuario')
	        console.log('VARIABLES DE SESION DESDE LOGIN', session.let);
			res.send(response) //SE LOGUEO
        }else{if(query.last_name =! null){ 
	        const response = {
	   			check:  "1"
	 		};
	 		const token = jwt.sign(response, config.llave, {
	   			expiresIn: 60 * 60 * 24
	  		});

	  		response.token = token;
	  		session.let = {
	            sesion: token,
	            id: query.id_contact,
	            email: query.email,
	            qr: query.tokenQr
       		 }

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

userCtrl.sendOcupations = async(req,res) =>{
 if(req.headers.authorization == session.let.sesion){
 	const sql= "SELECT ocupation FROM tbl_ocupations";
 	connection.query(sql, function(err, result, fie){
		if(err){ 
			throw err; 
			const response = {
   			check:  "3" //error de conexion con la DB
 			};
			res.send(response)
		}else{
			console.log('LAS OCUPACIONES PAAA', result)
			const response = {
				check: '1',
				ocupations: result
			}
			//console.log('send!!!!!!', result);
			//console.log('send', result[0].ocupation);
			res.send(response);
		}
		
	})
 }else{
		res.send('0')
		console.log('sesion expirada')
 	}

}



userCtrl.completeUser = async(req,res) =>{

//console.log('authorization!!!!', req.headers.authorization)
//console.log('sesion!!!!', session.let.sesion)

 if(req.headers.authorization == undefined){
 	req.headers.authorization = ''
 }

 if(req.headers.authorization == session.let.sesion){

 	//console.log("llegando desde flutter!!!!!!!!" , req.body.img_64.slice(0,10));
	const { id_business, ocupation, id_card_template, id_plan, email, passw, first_name, 
	last_name, phone_number1, phone_number2, phone_number3, address, city, state, zip_code, website, twitter, linkedin, facebook, 
	instagram } = req.body;
	let base64 = req.body.img_64;

	console.log('ocupacion antes!!!!!!!!!!!!!!!!!!!!1', instagram, twitter);
	const sql= "SELECT ocupation, id_ocupation FROM tbl_ocupations";
    connection.query(sql, function(err, result, fie){
		if(err){ 
			throw err; 
			const response = {
   			check:  "3" //error de conexion con la DB
 			};
			res.send(response)
		}else{
			//console.log('desde complete', result[0].ocupation)
			sendUser(result, ocupation)
			//console.log('el result desde query', result)
			//res.send(result)
		}
	})

async function sendUser(result){
	let ocup = result;
	let id_ocupation;
	 //console.log('RESULT DESDE FUNCT', ocup)
	 //console.log('SALIOOOO')
	 for (var i = 0; i <= ocup.length - 1; i++) {
	 	//console.log('ta entrando');
	 	if(ocupation == result[i].ocupation){
	 		//console.log('Funciono pa aqui está la vaina', ocup[i].ocupation, ocup[i].id_ocupation)
	 		id_ocupation = result[i].id_ocupation;
	 		break;
	 	}
	 }	
	//console.log('ERRR LASTNAME', lastName)
	let unique = uniqueKeygen(5)
	let imgNameCloud = unique+req.body.img_name;
	if(base64.length > 0){
		var ReadableData = require('stream').Readable;
		const imageBufferData = Buffer.from(base64, 'base64');
		var streamObj = new ReadableData();
		streamObj.push(imageBufferData)
		streamObj.push(null)
		streamObj.pipe(fs.createWriteStream(path.join(__dirname,'../src/public/img/'+imgNameCloud)));
		await cloudinary.uploader.upload(path.join(__dirname,'../src/public/img/'+imgNameCloud), {public_id: imgNameCloud}, function(error, result) { 
			if(error){
				fs.unlinkSync(path.join(__dirname,'../src/public/img/'+imgNameCloud))
				res.send('2');
			}else{
				//console.log('!!!!! LA URL PA', result.secure_url)
				//console.log('EL id_ocupation en base64!!!!!!', id_ocupation)
				const sql = "UPDATE tbl_contacts SET first_name = '"+first_name+"', last_name = '"+last_name+"', phone_number1 = '"+phone_number1+"', phone_number2 = '"+phone_number2+"', phone_number3 = '"+phone_number3+"', address = '"+address+"', state = '"+state+"', website = '"+website+"', linkedin = '"+linkedin+"', instagram = '"+instagram+"', twitter = '"+twitter+"', facebook = '"+facebook+"', zip_code = '"+zip_code+"',id_ocupation ='"+id_ocupation+"', img_url ='"+result.secure_url+"', img_name ='"+imgNameCloud+"' WHERE id_contact = '"+session.let.id+"'";
				connection.query(sql, function (error, results, fields) {
					if(error){
						fs.unlinkSync(path.join(__dirname,'../src/public/img/'+imgNameCloud))
						res.send('2');
						//console.log('ERROR', results);
					}
					if(results){
						fs.unlinkSync(path.join(__dirname,'../src/public/img/'+imgNameCloud))
						res.send('1');
						//console.log('Modifico pa con imagen', results);
					}
				});
			}
			//console.log('!!!ERRROR CLOUD', error)
		});

	}else{
		//console.log('EL id_ocupation en base64!!!!!!', id_ocupation)
		//const sql = "UPDATE tbl_contacts SET first_name = '"+first_name+"', last_name = '"+last_name+"', phone_number1 = '"+phone_number1+"', phone_number2 = '"+phone_number2+"', phone_number3 = '"+phone_number3+"', address = '"+address+"', state = '"+state+"', website = '"+website+"', linkedin = '"+linkedin+"', facebook = '"+facebook+"', zip_code = '"+zip_code+"', id_ocupation ='"+id_ocupation+"'WHERE id_contact = '"+session.let.id+"'";
		console.log('EN EL UPDATE!!!', twitter, instagram)
		const sql = "UPDATE tbl_contacts SET first_name = '"+first_name+"', last_name = '"+last_name+"', phone_number1 = '"+phone_number1+"', phone_number2 = '"+phone_number2+"', phone_number3 = '"+phone_number3+"', address = '"+address+"', state = '"+state+"', website = '"+website+"', linkedin = '"+linkedin+"', instagram = '"+instagram+"', twitter = '"+twitter+"', facebook = '"+facebook+"', zip_code = '"+zip_code+"', id_ocupation ='"+id_ocupation+"'WHERE id_contact = '"+session.let.id+"'";
				connection.query(sql, function (error, results, fields) {
					if(error){
						res.send('2');
						console.log('ERROR', results);
					}
					if(results){
						res.send('1');
						console.log('Modifico pa sin imagen', results);
					}
				});
	}
}
	
 }else{
		res.send('0')
		console.log('sesion expirada')
 	}

}

userCtrl.contactList = async(req, res) =>{
	
	if(req.headers.authorization == session.let.sesion){
		
		//console.log('EL TOKEN COMO GET',session.let.id);
		const sql = "SELECT tbl_contacts.email, tbl_contacts.id_contact, first_name, last_name, tbl_contacts.id_card_template, phone_number1, img_url, website, company, tbl_ocupations.ocupation, tbl_cards_templates.id_card_distribution FROM tbl_cards_shared INNER JOIN tbl_contacts ON tbl_cards_shared.id_contact_shared = tbl_contacts.id_contact INNER JOIN tbl_ocupations ON tbl_contacts.id_ocupation = tbl_ocupations.id_ocupation INNER JOIN tbl_cards_templates ON tbl_contacts.id_card_template = tbl_cards_templates.id_card_template WHERE tbl_cards_shared.id_contact='"+session.let.id+"'";
		console.log('sesion desde app',req.headers.authorization)
		console.log('sesion desde api', session.let.sesion)
		connection.query(sql, function(err, result, fie){
			if(err){ 
				throw err; 
				const response = {
						check: '3',
						contacts: []
					}  
				res.send(response)
				console.log('error en DB')
			}else{
				let complete_name;
				for(const res of result){
					complete_name = res.first_name + ' ' + res.last_name;
					res.complete_name = complete_name;
				}
				//console.log('CONTACTO!!!!!!',result)
				const contacts = {
					check: '1',
					contacts: result
				}
				//result.unshift({"check": 1})
				res.json(contacts);
			}
		});
	}else{
		const response = {
			check: '0',
			contacts: []
		}
		res.send(response)
		console.log('sesion expirada')
	}

}

userCtrl.addContact = async(req, res) =>{

	if(req.headers.authorization == session.let.sesion){
		const { qr } = req.body;
		let query;
		const sql= "SELECT id_contact, first_name, last_name, phone_number1 FROM `tbl_contacts` WHERE tokenQr = '"+qr+"'";
		//const sql= "SELECT * FROM tbl_contacts";
		connection.query(sql, function(err, result, fie){
			if(err){ 
				throw err; 
				const perfil = {
							check: '3',
							addContact: []
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
					addContact: []
				}  
					res.send(perfil)
			console.log('el usuario no existe')
		}

		function findShare(){

			//foto, nombre, apellido, profesion, empresa.
			//const sql = "SELECT tbl_contacts.first_name,last_name,phone_number1 FROM
			const sql= "SELECT id_contact_shared FROM `tbl_cards_shared` WHERE id_contact_shared = '"+query.id_contact+"' AND id_contact = '"+session.let.id+"'";
			//const sql= "SELECT * FROM tbl_contacts";
			connection.query(sql, function(err, result, fie){
				if(err){ 
					throw err;
					const perfil = {
							check: '3',
							addContact: []
						}  
					res.send(perfil)
					console.log('error en DB')
				}else{
				if(result.length <= 0){add()}
					if(result.length > 0){
						console.log('EL CONTACTO ADD', query);
						const perfil = {
							check: '4',
							addContact: []
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
					const response = {
						check: '3',
						addContact: []
					}
					res.send(response) //no pudo completar el registro
					console.log('error en DB')
				}else{ 
					console.log('success', result)
					console.log('EL CONTACTO ADD', query);
						const perfil = {
							check: '1', //se agrego usuario
							addContact:{
								first_name: query.first_name,
								last_name: query.last_name,
								phone_number1: query.phone_number1
							}
						} 
					
					res.send(perfil) //SE AGREGO USUARIO
					console.log('se agrego usuario')
				}	
			});
		}
    }else{
    	const response = {
			check: '0',
			contacts: []
		}
		res.send(response)
		console.log('sesion expirada')
    }
}

userCtrl.deleteContact = async(req, res) =>{
	if(req.headers.authorization == session.let.sesion){
		console.log('Estas en deleteContact')
		console.log(req.body.id, session.let.id);
		const sql= "DELETE FROM tbl_cards_shared WHERE id_contact = '"+session.let.id+"' AND id_contact_shared = '"+req.body.id+"'";
		//const sql= "DELETE FROM tbl_cards_shared WHERE id_contact = 3001 AND id_contact_shared = 3032";
		connection.query(sql, function(err, result, fie){
			if(err){ 
				//throw err;
				const user = {
						check: '3',
						contact: []
					}  
				res.send(user)
				console.log('error en DB')
			}else{
				const user = {
					check: '1', //envioe
					contact: []
				}
				res.send(user);	
			}
		});


	}else{
		const response = {
			check: '0',
			contacts: []
		}
		res.send(response)
		console.log('sesion expirada')
	}
}

userCtrl.userInfo = async(req, res) =>{

if(req.headers.authorization == session.let.sesion){
	console.log('estas en userInfo')
	//const sql= "SELECT first_name, last_name, city, state, zip_code, phone_number1, phone_number2, phone_number3, address, website, facebook, instagram, twitter, linkedin, img_url, img_name FROM `tbl_contacts` WHERE id_contact = '"+session.let.id+"'";
	const sql= "SELECT first_name, last_name, city, id_card_template, state, zip_code, phone_number1, phone_number2, phone_number3, address, website, facebook, instagram, twitter, linkedin, img_url, tbl_ocupations.ocupation FROM `tbl_contacts` INNER JOIN tbl_ocupations ON tbl_contacts.id_ocupation = tbl_ocupations.id_ocupation WHERE id_contact = '"+session.let.id+"'";

	connection.query(sql, function(err, result, fie){
		if(err) {
				console.log('error en la conexion intente de nuevo', err)
				//connection.end();
				res.send('3') //no pudo completar el registro
			}else{
				//console.log('pa ve el result', result[0]);
				//const resultJSON = result.map(res => res.toJSON());
				let imgCloud = result[0].img_url
				let base64;
				console.log('LA IMAGEN PAAAAA', imgCloud);
				const download = async () => {
				  		let image = await axios.get(imgCloud, {responseType: 'arraybuffer'});
						base64 = Buffer.from(image.data).toString('base64');
						//console.log(base64, 'EL RAW DE AXIOOOOS')
						result[0].img_64 = base64
						const user = {
							check: '1', //envioe
							contact: result[0]
						}
						res.send(user);	
				}
				download();
				////////////////ENVIO DE JSON//////////////////////////////////////7
			}	
	})
}else{
		const response = {
			check: '0',
			contacts: []
		}
		res.send(response)
		console.log('sesion expirada')
	}
	
}

userCtrl.contactInfo = async(req, res) =>{
  if(req.headers.authorization == session.let.sesion){
		console.log('estas en contactInfo')
		console.log('El email del contacto', req.headers.email)
		//const sql= "SELECT email, first_name, last_name, id_card_template,phone_number1, address, img_url ,website, tbl_ocupations.ocupation FROM `tbl_contacts` INNER JOIN tbl_ocupations ON tbl_contacts.id_ocupation = tbl_ocupations.id_ocupation WHERE email = '"+req.headers.email+"'";
		const sql = "SELECT email, id_contact, first_name, company, last_name, tokenQr,phone_number1, address, img_url, company, img_company, website, tbl_ocupations.ocupation, tbl_cards_templates.id_card_distribution, tbl_cards_templates.url_template FROM `tbl_contacts` INNER JOIN tbl_ocupations ON tbl_contacts.id_ocupation = tbl_ocupations.id_ocupation INNER JOIN tbl_cards_templates ON tbl_contacts.id_card_template = tbl_cards_templates.id_card_template WHERE email = '"+req.headers.email+"'";
		console.log('!!!!!!!!!AAAAAAAAAAAAAAAAAA')																																						 
		connection.query(sql, function(err, result, fie){
			if(err) {
					console.log('error en la conexion intente de nuevo', err)
					const response = {
						check: '3',
						contacts: []
					}
					res.send(response) //error en la conexion de a DB
				}else{
					console.log('pa ve el result', result);
					const contact = {
						check: '1',
						contact: result[0]
					}
					res.send(contact);	
				}
			
		})
  }else{
		const response = {
			check: '0',
			contacts: []
		}
		res.send(response)
		console.log('sesion expirada')
	}
}

userCtrl.sendQr = async(req, res) =>{

  if(req.headers.authorization == session.let.sesion){

  	console.log('ESTA EN SENDQR', session.let.qr)

  	const response = {
			check: '1',
			qr: session.let.qr
		}
		res.send(response)

  }else{
		const response = {
			check: '0',
			contacts: []
		}
		res.send(response)
		console.log('sesion expirada')
	}
}


module.exports = userCtrl;
