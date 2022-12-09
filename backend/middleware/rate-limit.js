// const rateLimit = require('express-rate-limit');

// const passwordLimiter = rateLimit({
//   max: 3,
//   windowMs: 60 * 60 * 1000,
//   message: "Trop de tentatives de connexion sur ce compte, veuillez réessayer plus tard MANU"
// });

// app.use(passwordLimiter);

// app.get('/login', passwordLimiter, (req, res) => res.send('Tentative de connexion échouée'));

module.exports = (req, res, next) => {
    try {
        
        next();
    } catch(error) {
        console.log(error);
       res.status(401).json({ error });
   }
};
