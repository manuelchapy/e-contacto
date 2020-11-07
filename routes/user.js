const { Router } = require('express');
const Ctrlindex	= require('../controllers/user.controllers');
const router = Router();

router.route('/completeUser')
		.post(Ctrlindex.completeUser)

router.route('/register')
		.post(Ctrlindex.register)

router.route('/login')
		.post(Ctrlindex.login)

router.route('/addContact')
		.post(Ctrlindex.addContact)

router.route('/contactList')
		.get(Ctrlindex.contactList)

module.exports = router;