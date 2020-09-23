const express = require('express');
const app = express();
const session = require('express-session');
const cors = require('cors');

// settings
app.set('port', process.env.PORT || 3000) //nombre de la variable, valor de la variable						

// middlewares
app.use(express.urlencoded({extended: false}));	
app.use(cors()); //cada vez que llegue una petición a mi servidor va permitir poder enviar y recibir datos
app.use(express.json()); //desde mi servidor se puede ver info en formato json y string

//Routes
app.use(require('../routes'));
app.use(require('../routes/index'));
//app.use(require('../routes/user'));

module.exports = app;