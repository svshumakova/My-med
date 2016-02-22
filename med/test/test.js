const request = require('supertest');
const app = require('../app.js');
const chai = require('chai');

const server = request.agent(app.listen());
describe('Connect to server', function () {
    it('should receive 404 from "/" rout', function (done) {
        server
            .head('/')
            .expect(404)
            .end(done);
    });
});

var userCorrect = {
    login: "demo",
    password: "demo"
}

describe('Authenticate success', function () {
    it('should return jwt', function (done) {
        server
            .post('/auth/login')
            .send(userCorrect)
            .expect(200)
            .end(function (err, res) {
                if(err){
                    return done(err);
                }

                var token = res.body.token;
                chai.expect(token).to.be.a('string');
                done();
            });
    });
});

let userIncorrect = {
    login: "demo",
    password: "demo1"
}
describe('Authenticate fail', function () {
    it('should return status 401', function (done) {
        server
          .post('/auth/login')
          .send(userIncorrect)
          .expect(401, done);
    });
});