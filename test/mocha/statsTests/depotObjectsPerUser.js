var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../../../server');
var createUserToken = require('../../common/jwtCreator').createUserToken;
var createUser = require('../../common/userCreator').createUser;
var deleteUser = require('../../common/userCreator').deleteUser;
var createDepot = require('../../common/depotCreator').createDepot;
var deleteDepots = require('../../common/depotCreator').deleteDepots;
var createDepotObject = require('../../common/depotObjectCreator').createDepotObject;
var deleteDepotObjects = require('../../common/depotObjectCreator').deleteDepotObjects;

chai.use(chaiHttp);

/**
 * Test suite for Stats functionalities.
 */
describe('Stats', function () {

    var name = "testUser";
    var email = "testUser@email.com";
    var password = "testPass";
    var depotsId = [];
    var depotObjectsId = [];

    /*
     * It creates a new user before the test suite starts executing.
     */
    before(function (done) {

        createUser(name, false, email, password, ["Pepe"], function () {

            createDepot("Depot name", email, "Depot Location", "Storage Room", "[0-1km]",
                "Depot Description", depotsId, function () {

                    createDepotObject(depotsId[0], email, "test depot object", null, "2017-06-17",
                        "2017-06-17", "Depot Description", depotObjectsId, done);
                });
        });

    });

    /**
     * Tests for depotObjectsPerUser stat.
     */
    describe("#depotObjectsPerUser()", function () {

        it('should successfully get the depotObjectsPerUser stats', function (done) {

            chai.request(server)
                .get('/adminStats/depotObjectsPerUser')
                .set('Authorization','Bearer ' + createUserToken(name, true))
                .end(function (err, result) {

                    result.should.have.status(200);
                    result.body.should.be.a('object');
                    result.body.should.have.property('depotObjectsPerUser');

                    done();

                });
        });

        it('should return an error since user isn\'t an admin', function (done) {

            chai.request(server)
                .get('/adminStats/depotObjectsPerUser')
                .set('Authorization','Bearer ' + createUserToken(name, false))
                .end(function (err, result) {

                    result.should.have.status(403);
                    result.body.should.be.a('object');
                    result.body.should.have.property('success');
                    result.body.success.should.equal(false);
                    result.body.should.have.property('message');
                    result.body.message.should.equal('No estás autorizado a acceder a esta operación.');

                    done();

                });
        });
    });


    /*
     * Removes the user created at the begining of the tests
     * after every test is finished.
     */
    after(function (done) {

        deleteDepotObjects(depotObjectsId, function () {
            deleteDepots(depotsId, function () {
                deleteUser(email, done);
            });
        });

    });
});
