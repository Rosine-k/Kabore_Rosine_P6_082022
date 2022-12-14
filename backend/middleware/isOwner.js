module.exports = (req, res, next) => {
   try {
      if (sauce.userId = req.auth.userId) {
         next();
      }
      else {
         console.log("Vous n'avez pas l'autorisation de modifier ou supprimer cette sauce / isOwner.js : " + error);
         res.status(403).json({ error: "Vous n'avez pas l'autorisation de modifier ou supprimer cette sauce." });
      }	   
   } catch(error) {
        console.log(error);
       res.status(401).json({ error });
   }
};