const mongoose = require('mongoose');
const userModel = require('../models/userModel');

const petSchema = new mongoose.Schema({
    animal: {type: String, required: true},
    race: {type: String, required: true},
    name: {type: String, required: true},
    age: {type: Number, required: true},
    weight: {type: Number, required: true},
    description: {type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId,ref: userModel},
})

module.exports = mongoose.model("Pet", petSchema);
