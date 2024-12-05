const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    animal: { type: String, required: true },
    race: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: Buffer, required: true },  // Buffer for binære data
    imageType: { type: String, required: false },  // Mimetype for billedet
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
});

module.exports = mongoose.model("Pet", petSchema);