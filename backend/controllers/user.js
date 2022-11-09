const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {

    const emailValidator =  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    const passwordValidator = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
    
    if (passwordValidator.test(req.body.password) || emailValidator.test(req.body.email)){
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user
            .save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch((error) => {
                console.log("Cette adresse email est déjà utilisée / signup / user.js : " + error);
                res.status(400).json({ error: "Cette adresse email est déjà utilisée." });
            })
        })
        .catch(error => res.status(500).json({ error }));
    }
    else {
        console.log("Format du mot de passe incorrect / signup / user.js : " + error);
        res.status(400).json({message: "Le mot de passe doit contenir 8 caractères comprenant : 1 majuscule, 1 minuscule et 1 chiffre"});
    }    
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log("Utilisateur non trouvé ! / login / user.js ");
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log('Mot de passe incorrect ! / login / user.js');
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch((error)=> res.status(500).json({error}))

        })
        .catch(error => res.status(500).json({ error }));

};