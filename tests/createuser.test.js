const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
chai.should();

describe('POST /create-user', () => {
    it('should create a new user and render login page', (done) => {
        chai.request(server)
            .post('/create-user')
            .send({ username: 'Test', password: '1234' })
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.include('login');
                done();
            });
    });

    it('should return 400 if username already exists', (done) => {
        chai.request(server)
            .post('/create-user')
            .send({ username: 'Test', password: '1234' })
            .end((err, res) => {
                res.should.have.status(400);
                res.text.should.eql('Brugernavn er allerede i brug.');
                done();
            });
    });
});