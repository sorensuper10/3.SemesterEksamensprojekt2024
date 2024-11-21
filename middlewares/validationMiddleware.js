exports.validatePet = (req, res, next) => {
    const { animal, race, name, age, weight, description } = req.body;
    if (!animal || !race || !name || !age || !weight || !description) {
        return res.status(400).json({ error: 'Ufuldstændige dyre-oplysninger. Alle undtagen user_id er påkrævet.' });
    }
    next();
};


