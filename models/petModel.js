const mongoose = require('mongoose');
const userModel = require('../models/userModel');  // This import is fine, but we don't need to use `userModel` directly in the ref.

const petSchema = new mongoose.Schema({
    animal: { type: String, required: true },
    race: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }  // Use 'User' as a string
});

module.exports = mongoose.model("Pet", petSchema);
