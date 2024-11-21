const express = require("express");
const petController = require("../controllers/petController");
const router = express.Router();

router.get("/pets", petController.getAllPets);
router.get('/pet', petController.getPetById);

router.post('/createPet',petController.createPet)
router.post('/pet/:id',petController.updatePet)

router.post('/pet/:id',petController.deletePet)

module.exports = router;