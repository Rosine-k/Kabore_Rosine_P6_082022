const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing);
    delete thingObject._id;
    delete thingObject._userId;
    const sauce = new Thing({
        ...thingObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce enregistré !' }) })
        .catch((error) => {
            console.log("La sauce n'a pas pu être enregistré / createSauce / sauces.js : " + error);
            res.status(400).json({ error: "La sauce n'a pas pu être enregistré" })
        })

};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => { res.status(200).json(sauce) })
        .catch(
            (error) => {
                console.log("La sauce ne peut pas être affiché / getOneSauce / sauces.js : " + error);
                res.status(404).json({ error: "La sauce ne peut pas être affiché" })
            }
        );
};

exports.modifySauce = (req, res, next) => {
    const thingObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete thingObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non autorisé' });
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...thingObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                    .catch((error) => {
                        console.log("La sauce n'a pas pu être modifié / modifySauce / sauces.js : " + error);
                        res.status(500).json({ error: "La sauce n'a pas pu être modifié" })
                    }
                    );
            }
        }
        )
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Not autorisé' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimé !' }) })
                        .catch(error =>
                            console.log("La sauce n'a pas pu être supprimé / deleteSauce / sauces.js : " + error),
                            res.status(500).json({ error: "La sauce n'a pas pu être supprimé" }));
                });
            }
        })
        .catch(error => {
            console.log("La sauce n'a pas été supprimé/ deleteSauce / sauces.js : " + error),
                res.status(500).json({ error: "La sauce n'a pas été supprimé" });
        });
};

exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            console.log("Les sauces n'ont pas pu être affichées / getAllSauce / sauces.js : " + error);
            res.status(500).json({ error: "Les sauces n'ont pas pu être affichées" });
        }
    );
};