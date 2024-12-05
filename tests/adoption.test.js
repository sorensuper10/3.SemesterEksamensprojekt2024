const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);

describe('Adoption API', () => {
    /**
     * Test the PUT route to update a user by ID
     */
    describe('PUT /users/:id', () => {
        it('should UPDATE an existing user', (done) => {
            const updatedUser = {
                username: "Soren",
                password: "newpassword123",  // Skift password her
                role: "user",  // Sørg for at opdatere rollen korrekt, hvis nødvendigt
            };

            chai.request(server)
                .put('/users/1')  // Brug den rigtige ID for en eksisterende bruger
                .send(updatedUser)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('username').eql('Soren');
                    done();
                });
        });

        it('should return 404 if the user to update is not found', (done) => {
            const updatedUser = {
                username: "Non Existent username",
                password: "newpassword123",
                role: "user",
            };

            chai.request(server)
                .put('/users/999')  // Brug en ID der ikke findes
                .send(updatedUser)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('User not found');
                    done();
                });
        });
    });

    /**
     * Test the DELETE route to remove a user by ID
     */
    describe('DELETE /users/:id', () => {
        it('should DELETE an existing user', (done) => {
            chai.request(server)
                .delete('/users/10')  // Brug den rigtige ID for en eksisterende bruger
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eql('User deleted');
                    done();
                });
        });

        it('should return 404 if the user to delete is not found', (done) => {
            chai.request(server)
                .delete('/users/999')  // Brug en ID der ikke findes
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('message').eql('User not found');
                    done();
                });
        });
    });
});