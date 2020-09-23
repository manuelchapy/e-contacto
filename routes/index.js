const { Router } = require('express');
const Ctrlindex	= require('../controllers/index.controllers');
const router = Router();


router.route('/')
		.get(Ctrlindex.getIndex)

module.exports = router;