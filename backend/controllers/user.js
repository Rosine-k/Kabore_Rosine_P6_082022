const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


const User = require('../models/user');

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
                console.log("L'utilisateur n'a pas été crée / signup / user.js : " + error);
                res.status(500).json({ error: "L'utilisateur n'a pas été crée." });
            });
        })
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                console.log("Utilisateur non trouvé ! / login / user.js ");
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        console.log('Mot de passe incorrect ! / login / user.js' );
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => 
                    console.log("Connexion impossible / login / user.js : " + error),
                    res.status(500).json({ error: "Connexion impossible "  }));
                })
        .catch(error => 
            console.log("Connexion impossible / login / user.js : " + error),
            res.status(500).json({ error: "Connexion impossible " }));
};