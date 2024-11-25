const express = require("express");
const petController = require("../controllers/petController");
const {validatePet} = require("../middlewares/validationMiddleware");
const router = express.Router();

router.get("/pets", petController.getAllPets);
router.get('/pet', petController.getPetById);
router.get('/adoption', petController.getAdoptionPage)
router.get('/createPet', petController.createPetEJS);
router.post('/createPet', validatePet, petController.createPet);

router.post('/pet/:id', validatePet, petController.updatePet)

router.post('/pet/:id',petController.deletePet)

module.exports = router;