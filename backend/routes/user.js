const express = require('express');
const router = express.Router();
const rateLimiter = require('../middleware/rate-limit');
const userCtrl = require('../controllers/user');
const verifIdentifiants = require('../middleware/verif-identifiants');

router.post('/signup', verifIdentifiants, userCtrl.signup);
router.post('/login',rateLimiter, userCtrl.login);

module.exports = router;