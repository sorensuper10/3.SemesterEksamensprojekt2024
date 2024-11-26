const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();

chai.use(chaiHttp);

describe('Adoption API', () => {
    /**
     * Test the GET route for all users
     */
    describe('GET /users', () => {
        it('should GET all the users', (done) => {
            chai.request(server)
                .get('/allUsers')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(5);
                    done();
                });
        });
    });
});