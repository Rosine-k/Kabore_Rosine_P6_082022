module.exports = (req, res, next) => {
   try {
      // if (sauce.userId = req.auth.userId) {
      //    next();
      // }
      // else {
      //    alert("Vous n'avez pas l'autorisation de modifier ou supprimer cette sauce.");
      // }
	   next();
   } catch(error) {
        console.log(error);
       res.status(401).json({ error });
   }
};