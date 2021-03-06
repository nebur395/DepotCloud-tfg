var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../../../server');
var createUserToken = require('../../common/jwtCreator').createUserToken;
var createUser = require('../../common/userCreator').createUser;
var deleteUser = require('../../common/userCreator').deleteUser;


chai.use(chaiHttp);

/**
 * Test suite for User functionalities.
 */
describe('User', function () {

    var name = "testUser";
    var email = "testUser@email.com";
    var password = "testPass";

    /*
     * It creates a new user before the test suite starts executing.
     */
    before(function (done) {

        createUser(name, false, email, password, [], done);

    });

    /**
     * Tests for deleteUser functionality.
     */
    describe("#deleteUser()", function () {

        it('should successfully delete a user account', function (done) {

            chai.request(server)
                .delete('/users/' + email)
                .send({current: password})
                .set('Authorization','Bearer ' + createUserToken(name, false))
                .end(function (err, result) {

                    result.should.have.status(200);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(true);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Cuenta de usuario eliminada correctamente.');

                    chai.request(server)
                        .get('/login/')
                        .auth(email, password)
                        .end(function (err, result) {

                            result.should.have.status(404);
                            result.body.should.be.a('object');
                            result.body.should.have.property('success');
                            result.body.success.should.equal(false);
                            result.body.should.have.property('message');
                            result.body.message.should.equal('La cuenta no está activa. Contacte con el administrador.');

                            done();

                        });

                });
        });

        it('should return an error since the user\'s password is wrong', function (done) {

            chai.request(server)
                .delete('/users/' + email)
                .send({current: "wrongPass"})
                .set('Authorization','Bearer ' + createUserToken(name, false))
                .end(function (err, result) {

                    result.should.have.status(404);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Email o contraseña incorrectos.');

                    done();

                });
        });

        it('should return an error message since password is blank', function (done) {

            chai.request(server)
                .delete('/users/' + email)
                .send({current: ""})
                .set('Authorization','Bearer ' + createUserToken(name, false))
                .end(function (err, result) {

                    result.should.have.status(404);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Contraseña incorrecta.');

                    done();

                });
        });
    });


    /*
     * Removes the user created at the begining of the tests
     * after every test is finished.
     */
    after(function (done) {

        deleteUser(email, done);

    });
});
