const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const isOwner = require('../middleware/isOwner');
const multer = require('../middleware/multer-config');
const verifChamp = require('../middleware/verif-champ');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getSauce);
router.get('/:id', auth, saucesCtrl.getSauceById);
router.post('/', auth, multer, verifChamp, saucesCtrl.createSauce);
router.post('/:id/like',auth, saucesCtrl.likeSauce);
router.put('/:id', auth, isOwner,verifChamp, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth,  isOwner, saucesCtrl.deleteSauce);

module.exports = router;