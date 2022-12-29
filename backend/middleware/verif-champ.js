
module.exports = (req, res, next) => {
    try {
        // validation Regex des champs du formulaire
        const textValidator = /^[A-Za-z0-9 _.,!"'/$]*/;
        
        // si le nom, la marque, la description et les ingrédients sont conformes au format, la création de sauce est possible
        if (textValidator.test(req.body.name) && textValidator.test(req.body.manufacturer) && textValidator.test(req.body.description) &&  textValidator.test(req.body.mainPepper)) {
            next();
        }
        else {
            // erreur: la création de sauce n'est pas possible car les champs sont incorrects
            console.log("Format des champs incorrects / verif-champ.js  ");
            res.status(400).json({message: "Format des champs incorrects"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ error });
    }
};        