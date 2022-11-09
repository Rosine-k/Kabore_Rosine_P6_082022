require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');


mongoose.connect('mongodb+srv://Rosizou:Leslie75018@cluster0.qoxtth6.mongodb.net/sauce?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

const rateLimit = require('express-rate-limit');

const passwordLimiter = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: "Trop de tentatives de connexions sur ce compte, veuillez réessayer plus tard"
});

app.use(passwordLimiter);

app.get('/login', passwordLimiter, (req, res) => res.send('Tentative de connexion échouée'));


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;