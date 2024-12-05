const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
chai.should();

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