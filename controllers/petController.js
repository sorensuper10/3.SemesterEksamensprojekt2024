const Pet = require('../models/petModel');
const User = require("../models/userModel");

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
        res.redirect('/dashboardadmin');
    }catch (error) {
    res.status(500).send('fejl ved oprettelse af kæledyr');}
}

exports.getAllPets = async (req, res) => {
    try {
        // Find pets that have no userId (not adopted)
        const pets = await Pet.find({ userId: { $exists: false } }); // Only pets that are not adopted
        res.render('adoption', { pets });
    } catch (error) {
        res.status(500).send("fejl ved hentning af kæledyr");
    }
}


exports.viewAllPets = async (req, res) => {
    try {
        const pets = await Pet.find()
            .populate('userId', 'username')  // Sørg for at populere med 'name' fra User
            .exec();

        const petCount = pets.length;

        // Renderer siden og sender pet- og petCount data til viewet
        res.render('allPets', { pets, petCount });
    } catch (error) {
        console.error(error);
        res.status(500).send("Der opstod en fejl.");
    }
};


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
        res.redirect('/allPets')
    } catch (error) {
        res.status(500).send("fejl ved opdatering af post");
    }
}

exports.adoptPet = async (req, res) => {
    try {
        const userId = req.session.userId;  // Get userId from session

        // Find the pet by ID
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).send("Pet not found");
        }

        // Update the pet's userId to mark it as adopted by the current user
        pet.userId = userId;

        // Optionally, if you need to set any other fields (like pet_id), do it here:
        // pet.pet_id = req.body._id;

        await pet.save(); // Save the changes

        res.redirect("/adoption"); // Redirect to adoption page after success
    } catch (error) {
        console.error("Error adopting pet:", error);
        res.status(500).send("Something went wrong while adopting the pet.");
    }
};




exports.deletePet = async (req, res) => {
    try {
        await Pet.findByIdAndDelete(req.params.id);
        res.redirect('/allPets');
    } catch (error) {
        res.status(500).send("fejl ved sletning af pet");
    }
}

// Registrering funktion
exports.createPetEJS = (req, res) => {
    res.render("createPet");
};