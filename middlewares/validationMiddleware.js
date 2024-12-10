const multer = require('multer');

// Konfiguration af Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Angiv mappe til uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Generer unikt filnavn
    }
});

// Filtype-validering
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accepter billedfiler
    } else {
        cb(new Error('Kun billedfiler er tilladt'), false); // Afvis ikke-billedfiler
    }
};

// Multer upload middleware
const upload = multer({ storage, fileFilter }).single('image');

// Middleware til upload og validering
exports.validatePet = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            // Returner fejl, hvis der opstår problemer med upload
            return res.status(400).json({ error: err.message });
        }

        // Valider dyreoplysninger (undlader billedet her)
        const { animal, race, name, age, weight, description } = req.body;
        if (!animal || !race || !name || !age || !weight || !description) {
            return res.status(400).json({ error: 'Ufuldstændige dyreoplysninger. Alle felter undtagen user_id er påkrævet.' });
        }

        // Fortsæt til controlleren
        next();
    });
};