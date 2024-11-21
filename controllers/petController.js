const Pet = require('../models/petModel');

exports.createPet = async (req, res) => {
    try {
        const newPet = new Pet({
            animal: req.body.animal,
            race: req.body.race,
            name: req.body.name,
            age: req.body.age,
            weight: req.body.weight,
            description: req.body.description,
        });
        await newPet.save();
        res.redirect('/');
    }catch (error) {
    res.status(500).send('fejl ved oprettelse af kæledyr');}
}

exports.getAllPets = async (req, res) => {
    try {
        const pets =await Pet.find()
        res.render('index', {pets})
    } catch (error) {
        res.status(500).send("fejl ved hentning af kæledyr");
    }
}

exports.getPetById = async (req, res) => {
    try {
       await Pet.findById(req.params.id);
        res.render('index')
    } catch (error) {
        res.status(500).send("fejl ved hentning af kæledyr");
    }
}

exports.updatePet = async (req, res) => {
    try {
        await Pet.findByIdAndUpdate(req.params.id,{
            animal: req.body.animal,
            race: req.body.race,
            name: req.body.name,
            age: req.body.age,
            weight: req.body.weight,
            description: req.body.description,
            userId: req.body.userId,
        })
        res.redirect('/')
    } catch (error) {
        res.status(500).send("fejl ved opdatering af post");
    }
}

exports.deletePet = async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.redirect('/');
    } catch (error) {
        res.status(500).send("fejl ved sletning af pet");
    }
}

// Registrering funktion
exports.createPetEJS = (req, res) => {
    res.render("createPet");
};