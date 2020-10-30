const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');
const config = require('./config');
const jwt = require('jsonwebtoken');
bodyParser = require('body-parser');



// settings
app.set('port', process.env.PORT || 3000) //nombre de la variable, valor de la variable						




// middlewares
app.use(express.urlencoded({extended: false}));	
app.use(cors()); //cada vez que llegue una petición a mi servidor va permitir poder enviar y recibir datos
app.use(express.json()); //desde mi servidor se puede ver info en formato json y string
app.use(session({
	secret: '24781279_econtacto',
	resave: true,
	sevenUninitialized: true
}));

//Routes
app.use(require('../routes'));
app.use(require('../routes/index'));
app.use(require('../routes/user'));

module.exports = app;