const Sauce = require('../models/sauce');
const fs = require('fs');

// gestion de la création de sauces
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [' '],
        usersDisliked: [' '],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch((error) => {
            console.log("La sauce n'a pas pu être enregistrée / createSauce / sauces.js : " + error);
            res.status(400).json({ error: "La sauce n'a pas pu être enregistrée" });
        })

};

// gestion de la récupérarion d'une sauce
exports.getSauceById = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauces) => { res.status(200).json(sauces) })
        .catch((error) => {
            console.log("La sauce ne peut pas être affiché / getSauceById / sauces.js : " + error);
            res.status(404).json({ error: "La sauce ne peut pas être affiché" });
        })
};

// gestion de la récupérarion de toutes les sauces
exports.getSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch((error) => {
            console.log("Les sauces n'ont pas pu être affichées / getSauce / sauces.js : " + error);
            res.status(500).json({ error: "Les sauces n'ont pas pu être affichées" });
        });
};

// gestion de la modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // si l'utilisateur a crée la sauce, il est autorisé à la modifier
            Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce modifié!' }))
                .catch((error) => {
                    console.log("La sauce n'a pas pu être modifié / modifySauce / sauces.js : " + error);
                    res.status(500).json({ error: "La sauce n'a pas pu être modifié" });
                });
        })
        .catch((error) => {
            console.log("La sauce n'a pas été trouvé : " + error);
            res.status(500).json({ error: "La sauce n'a pas été trouvé" });
        });
};

// gestion de la suppression des sauces
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé!' }))
            });
        })
        .catch((error) => {
            console.log("La sauce n'a pas été supprimé/ deleteSauce / sauces.js : " + error);
            res.status(500).json({ error: "La sauce n'a pas été supprimé" });
        });
};

// gestion des likes et dislikes
exports.likeSauce = (req, res, next) => {
    // Like
    if (req.body.like === 1) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (!sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: +1 },
                        $push: { usersLiked: req.auth.userId }
                    })
                        .then(() => res.status(200).json({ message: "Sauce liké" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    } else if (req.body.like === -1) { // Dislike

        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: -1 },
                        $push: { usersDisliked: req.auth.userId }
                    })
                        .then(() => res.status(200).json({ message: "Sauce disliké" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    } else { // Retiré like ou dislike
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.auth.userId }
                    })
                        .then(() => res.status(200).json({ message: "Like retiré" }))
                        .catch((error) => res.status(400).json({ error }))
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    Sauce.updateOne({ _id: req.params.id }, {
                        $inc: { dislikes: -1 },
                        $pull: { usersDisliked: req.auth.userId }
                    })
                        .then(() => res.status(200).json({ message: "Dislike retiré" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
            .catch((error) => res.status(400).json({ error }))
    }
}