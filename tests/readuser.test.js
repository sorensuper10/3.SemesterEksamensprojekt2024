const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');  // Sørg for, at stien er korrekt til din app

chai.use(chaiHttp);
chai.should();

describe('GET /allUsers', () => {
    let agent;

    // Før testen logges der ind med den eksisterende bruger
    before((done) => {
        // Brug en "agent", som håndterer sessioner og cookies
        agent = chai.request.agent(server);

        // Log ind med en eksisterende bruger
        agent.post('/login')  // Antag, at du har en login-rute
            .send({ username: 'admin', password: 'admin' })  // Brug den eksisterende brugers loginoplysninger
            .end((err, res) => {
                res.should.have.status(200);  // Forvent succes ved login
                done();
            });
    });

    // Testen for at hente alle brugere
    it('should GET all users and render the dashboard', (done) => {
        agent.get('/allUsers')  // Brug agenten til at sende anmodningen
            .end((err, res) => {
                res.should.have.status(200);  // Forvent 200 OK status
                res.text.should.include('dashboard');  // Tjek om dashboard vises i svaret
                done();
            });
    });

    // Ryd op efter testen
    after(() => {
        agent.close();  // Luk agenten for at afslutte sessionen
    });
});
