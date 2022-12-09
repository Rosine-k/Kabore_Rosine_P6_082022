const textValidator = /^[a-zA-Z0-9]*$/;



module.exports = (req, res, next) => {
    try {
        console.log(req.body.sauce);
        next();
        // const verify = {
        //     name: textValidator,
        //     manufacturer: textValidator,
        //     description: textValidator,
        //     mainPepper: textValidator
        // }
        
        // if (verify = textValidator) {
        //     next();
        // }
        // else {
        //     alert('Veuillez entrer des champs valides');
        // }
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ error });
    }
};        