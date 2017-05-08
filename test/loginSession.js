var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../server.js');
var User = server.models.User;
var config = require("../config");
var jwt = require('jsonwebtoken');

chai.use(chaiHttp);

/**
 * Test suite for Session functionalities.
 */
describe('Session', function(){

    var name = "Testing";
    var email = "testUser@email.com";
    var password = "testPass";
    var hashPass = require('crypto')
        .createHash('sha1')
        .update(password)
        .digest('base64');
    var emailInactive = 'testInactive@email.com';

    /*
     * It creates a new user before the test suite starts executing.
     */
    before(function(done){

        User.create({

            email: email,
            name: name,
            password: hashPass,
            admin: false

        }, function(){
            done();
        });


    });

    /**
     * Tests for logIn functionality.
     */
    describe("#logIn()", function(){

        var loginErrorMessage = "Email o contraseña incorrectos";

        it('should successfully login ', function(done){

            chai.request(server)
                .get('/login/')
                .auth(email, password)
                .end(function(err, result){

                    result.should.have.status(200);
                    result.body.should.be.a('object');
                    result.body.should.have.property('token');
                    var token = result.body.token;
                    jwt.verify(token, config.secret, function (err, decoded) {
                        var user = decoded;
                        user.should.be.a('object');
                        user.should.have.property('email');
                        user.email.should.equal(email);
                        user.should.have.property('name');
                        user.name.should.equal(name);
                        user.should.have.property('members');
                        user.members.should.be.an.instanceOf(Array);
                        user.members.should.have.lengthOf(0);
                        user.should.have.property('admin');
                        user.admin.should.equal(false);
                        done();
                    });

                });
        });

        it('should return an error since the user doesn\'t exist', function(done){

            chai.request(server)
                .get('/login/')
                .auth("false@email.com", password)
                .end(function(err, result){

                    result.should.have.status(404);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Email o contraseña incorrectos.');

                    done();
                });
        });

        it('should return an error since the user\'s password is wrong', function(done){

            chai.request(server)
                .get('/login/')
                .auth(email, "wrongPass")
                .end(function(err, result){

                    result.should.have.status(404);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Email o contraseña incorrectos.');

                    done();
                });
        });

        it('should return an error since the email is blank', function(done){

            chai.request(server)
                .get('/login/')
                .auth("", password)
                .end(function(err, result){

                    result.should.have.status(404);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Email o contraseña incorrectos.');

                    done();
                });
        });

        it('should return an error since the password is blank', function(done){

            chai.request(server)
                .get('/login/')
                .auth(email, "")
                .end(function(err, result){

                    result.should.have.status(404);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('Email o contraseña incorrectos.');

                    done();
                });
        });
    });


    /*
     * Removes the user created at the begining of the tests
     * after every test is finished.
     */
    after(function(done){
        User.collection.remove({"email":email});
        done();
    });
});