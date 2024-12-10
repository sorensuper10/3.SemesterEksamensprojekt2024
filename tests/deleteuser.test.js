const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

chai.use(chaiHttp);
chai.should();

/**
 * Test the DELETE route to remove a user by ID
 */
describe('POST /user/:id/delete', () => {
    let userId;
    let agent;

    before((done) => {
        // Opret en testbruger
        const testUser = new User({
            username: 'TestUser42',
            passwordHash: bcrypt.hashSync('password', 10)  // Hashe password korrekt
        });

        testUser.save()
            .then(user => {
                userId = user._id; // Gem brugerens ID
                agent = chai.request.agent(server); // Opret en agent til at opretholde sessionen
                agent
                    .post('/login')  // Post til login ruten (juster hvis login-metoden er anderledes)
                    .send({
                        username: 'TestUser42',
                        password: 'password'  // Brug det rigtige password
                    })
                    .end((err, res) => {
                        res.should.have.status(200);  // Sørg for login lykkedes
                        done();
                    });
            });
    });

    it('should DELETE an existing user', (done) => {
        agent
            .post(`/user/${userId}/delete`)  // Brug den rigtige ID for den oprettede bruger
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });

    it('should return 404 if the user to delete is not found', (done) => {
        agent
            .delete('/user/999/delete')  // Brug et ID der ikke findes
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});