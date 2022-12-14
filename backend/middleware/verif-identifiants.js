module.exports = (req, res, next) => {
    try {
        // validation du champ de l'email
        const emailValidator =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
        //validation du champ du mot de passe
        const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

       // si le mot de passe et l'email sont aux bons formats, la création de compte est possible
       if (passwordValidator.test(req.body.password) || emailValidator.test(req.body.email)) {
          next();
        }
        // erreur: le format n'est pas correct
        else {
            console.log("Format du mot de passe incorrect / verif-identifiants.js : " + error);
            res.status(400).json({message: "Le mot de passe doit contenir 8 caractères comprenant : 1 majuscule, 1 minuscule et 1 chiffre"});
        } 	   
    } catch(error) {
         console.log(error);
        res.status(401).json({ error });
    }
 };