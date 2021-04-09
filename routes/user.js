const { Router } = require('express');
const Ctrlindex	= require('../controllers/user.controllers');
const router = Router();

router.route('/completeUser')
		.post(Ctrlindex.completeUser)

router.route('/sendOcupations')
		.get(Ctrlindex.sendOcupations)


router.route('/register')
		.post(Ctrlindex.register)

router.route('/login')
		.post(Ctrlindex.login)

router.route('/addContact')
		.post(Ctrlindex.addContact)

router.route('/deleteContact')
		.post(Ctrlindex.deleteContact)

router.route('/contactList')
		.get(Ctrlindex.contactList)

router.route('/userInfo')
		.get(Ctrlindex.userInfo)

router.route('/contactInfo')
		.get(Ctrlindex.contactInfo)

router.route('/sendQr')
		.get(Ctrlindex.sendQr)

module.exports = router;