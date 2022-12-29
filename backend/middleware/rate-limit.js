const rateLimit = require('express-rate-limit');

// si l'utilisateur entre des identifiants incorrects, il a le droit à 3 essais avant qu'il puisse réessayer 1h plus tard
const limiter = rateLimit({
   max: 3,
   windowMs: 60 * 60 * 1000,
   message: "Trop de tentatives de connexion sur ce compte, veuillez réessayer plus tard"
 });

 module.exports = rateLimit(limiter);
