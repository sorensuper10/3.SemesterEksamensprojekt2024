const express = require("express");
const petController = require("../controllers/petController");
const {validatePet} = require("../middlewares/validationMiddleware");
const Pet = require("../models/petModel");
const router = express.Router();

router.get('/adoption', petController.getAllPets)
router.get('/pet', petController.getPetById);
router.get('/createPet', petController.createPetEJS);
router.post('/createPet', validatePet, petController.createPet);

router.get('/editPet/:id', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id); // Find dyr ved ID
        if (!pet) {
            return res.status(404).send('Dyr blev ikke fundet');
        }
        // Sender dyredata til EJS
        res.render('editPet', {pet});
    } catch (err) {
        console.error(err);
        res.status(500).send("Fejl ved hentning af dyr til opdatering");
    }
});

router.get('/pets/:id/image', async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet || !pet.image) {
            return res.status(404).send('Image not found');
        }
        res.set('Content-Type', pet.imageType);
        res.send(pet.image);
    } catch (err) {
        res.status(500).send('Fejl ved hentning af billede');
    }
});

router.get('/deletePet', petController.deletePet);

router.post('/editPet/:id', validatePet, petController.updatePet)

router.post('/deletePet/:id',petController.deletePet)

router.post('/adoption/:id',petController.adoptPet);

module.exports = router;