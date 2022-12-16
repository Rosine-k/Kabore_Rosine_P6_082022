const Sauce = require('../models/sauce');
// gestion de l'authentification si l'utilisateur veut modifier ou supprimer une sauce
module.exports = (req, res, next) => {
   try {
      Sauce.findOne({ _id: req.params.id })
         .then(sauce => {
            // si l'utilisateur a créer la sauce, la modification ou suppression est possible
            if (sauce.userId == req.auth.userId) {
               console.log('est propriétaire');
               next();
            }
            // si l'utilisateur n'a pas créer la sauce, la modification ou suppression est possible
            else {
               console.log("Vous n'avez pas l'autorisation de modifier ou supprimer cette sauce / isOwner.js : " + error);
               res.status(403).json({ error: "Vous n'avez pas l'autorisation de modifier ou supprimer cette sauce." });
            }
         })
         .catch((error) => {
            console.log("La sauce n'a pas été trouvé : " + error);
            res.status(500).json({ error: "La sauce n'a pas été trouvé" });
         });
   } catch (error) {
      console.log(error);
      res.status(401).json({ error });
   }
};