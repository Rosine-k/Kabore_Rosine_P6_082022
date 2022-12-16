const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

// gestion de l'inscription
exports.signup = (req, res, next) => {
    
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
        
};

// gestion de la connexion
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // si l'identifiant n'est pas correct, refus de connexion
            if (!user) {
                console.log("Utilisateur non trouvé ! / login / user.js ");
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then(valid => {
                    // si le mot de passe n'est pas correct, refus de connexion
                    if (!valid) {
                        console.log('Mot de passe incorrect ! / login / user.js');
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // si l'identifiant et le mot de passe sont corrects, autorisation de connexion
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