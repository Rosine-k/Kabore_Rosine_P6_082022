const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const isOwner = require('../middleware/isOwner');
const multer = require('../middleware/multer-config');
const verif = require('../middleware/verif-champ');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getSauce);
router.get('/:id', auth, saucesCtrl.getSauceById);
router.post('/', auth, multer, verif, saucesCtrl.createSauce);
router.post('/:id/like',auth, saucesCtrl.likeSauce);
router.put('/:id', auth, isOwner,verif, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth,  isOwner, saucesCtrl.deleteSauce);

module.exports = router;