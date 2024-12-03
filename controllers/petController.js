const Pet = require('../models/petModel');

exports.createPet = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        const newPet = new Pet({
            animal: req.body.animal,
            race: req.body.race,
            name: req.body.name,
            age: req.body.age,
            weight: req.body.weight,
            description: req.body.description,
            image: req.file ? '/uploads/' + req.file.filename : null // Stien til billedet
        });

        await newPet.save();
        res.redirect('/dashboardadmin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Fejl ved oprettelse af kæledyr');
    }
};

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
        const userId = req.session.userId;
        if (!userId) {
            return res.status(403).send("Du skal være logget ind for at adoptere.");
        }
        const pet = await Pet.findById(req.params.id);
        if (!pet) {
            return res.status(404).send("Dyret blev ikke fundet.");
        }
        if (pet.userId) {
            return res.status(400).send("Dette dyr er allerede adopteret.");
        }
        pet.userId = userId;
        await pet.save();
        res.redirect("/myadoptions");
    } catch (error) {
        console.error("Fejl under adoption:", error);
        res.status(500).send("Noget gik galt under adoptionen.");
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