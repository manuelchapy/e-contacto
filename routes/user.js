const { Router } = require('express');
const Ctrlindex	= require('../controllers/user.controllers');
const router = Router();

router.route('/completeUser')
		.post(Ctrlindex.completeUser)

router.route('/register')
		.post(Ctrlindex.register)

router.route('/login')
		.post(Ctrlindex.login)

router.route('/shareContact')
		.get(Ctrlindex.shareContact)

module.exports = router;