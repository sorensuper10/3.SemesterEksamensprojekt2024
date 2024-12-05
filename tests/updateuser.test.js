const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../models/userModel');

chai.use(chaiHttp);
chai.should();

describe('PUT /users/:id', () => {
    let userId;

    // Opret en bruger til at opdatere i testen
    before((done) => {
        const testUser = new User({
            username: 'TestUser4',
            passwordHash: 'hashedpassword',  // Brug den korrekte metode til at hashe password
            role: 'user',
        });

        testUser.save()
            .then(user => {
                userId = user._id;  // Gem brugerens ID for at kunne opdatere den senere
                console.log('Test User ID:', userId);  // Log ID'et til fejlfindingsformål
                done();
            })
            .catch(err => done(err));
    });

    // Test for succesfuld opdatering af bruger
    it('should UPDATE an existing user', (done) => {
        const updatedUser = {
            username: 'SorenLugter4',
            password: 'newpassword123',  // Skift password her
            role: 'admin',  // Hvis du også vil opdatere rollen
        };

        chai.request(server)
            .put(`/users/${userId}`)  // Brug den rigtige ID for den testoprettede bruger
            .send(updatedUser)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('username').eql('SorenLugter');
                res.body.should.have.property('role').eql('admin');  // Verificer opdateret rolle
                done();
            });
    });

    // Test for når brugeren ikke findes
    it('should return 404 if the user to update is not found', (done) => {
        const updatedUser = {
            username: "Non Existent username",
            password: "newpassword123",
            role: "user",
        };

        chai.request(server)
            .put('/users/999999999999999999999999')  // Brug en ID, der ikke findes i databasen
            .send(updatedUser)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.have.property('message').eql('Brugeren blev ikke fundet');
                done();
            });
    });
});
