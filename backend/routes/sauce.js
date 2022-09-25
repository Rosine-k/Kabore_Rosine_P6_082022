const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesCtrl = require('../controllers/sauces');

router.get('/', auth, saucesCtrl.getSauce);
router.get('/:id', auth, saucesCtrl.getSauceById);
router.post('/', auth, multer, saucesCtrl.createSauce);
router.post('/:id/like', saucesCtrl.likeSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);

module.exports = router;