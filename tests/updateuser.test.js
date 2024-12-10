const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../models/userModel');

chai.use(chaiHttp);
chai.should();

describe('POST /user/:id/edit - Opdater bruger', () => {
    let userId;

    // Opret en bruger til at opdatere
    before((done) => {
        const testUser = new User({
            username: 'TestUser53',
            passwordHash: 'hashedpassword',  // Brug den korrekte metode til at hashe password
        });

        testUser.save()
            .then(user => {
                userId = user._id;  // Gem brugerens ID
                console.log('Test User ID:', userId);  // Bekræft at ID'et er korrekt
                done();
            })
            .catch(err => done(err));
    });

    // Test for opdatering af bruger
    it('should UPDATE a user successfully', (done) => {
        const updatedUser = {
            username: 'UpdatedUsername3',
            password: 'newpassword123',  // Ny adgangskode
        };

        chai.request(server)
            .post(`/user/${userId}/edit`)  // Brug POST og den gemte userId
            .send(updatedUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    // Test for når brugeren ikke findes
    it('should return 404 if the user to update is not found', (done) => {
        const updatedUser = {
            username: 'NonExistentUser',
            password: 'newpassword123',
        };

        chai.request(server)
            .post('/user/999999999999999999999999/edit')  // Brug et ID, der ikke findes
            .send(updatedUser)
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});