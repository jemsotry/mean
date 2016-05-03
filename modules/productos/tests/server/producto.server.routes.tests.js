'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Producto = mongoose.model('Producto'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, producto;

/**
 * Producto routes tests
 */
describe('Producto CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Producto
    user.save(function () {
      producto = {
        name: 'Producto name'
      };

      done();
    });
  });

  it('should be able to save a Producto if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Producto
        agent.post('/api/productos')
          .send(producto)
          .expect(200)
          .end(function (productoSaveErr, productoSaveRes) {
            // Handle Producto save error
            if (productoSaveErr) {
              return done(productoSaveErr);
            }

            // Get a list of Productos
            agent.get('/api/productos')
              .end(function (productosGetErr, productosGetRes) {
                // Handle Producto save error
                if (productosGetErr) {
                  return done(productosGetErr);
                }

                // Get Productos list
                var productos = productosGetRes.body;

                // Set assertions
                (productos[0].user._id).should.equal(userId);
                (productos[0].name).should.match('Producto name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Producto if not logged in', function (done) {
    agent.post('/api/productos')
      .send(producto)
      .expect(403)
      .end(function (productoSaveErr, productoSaveRes) {
        // Call the assertion callback
        done(productoSaveErr);
      });
  });

  it('should not be able to save an Producto if no name is provided', function (done) {
    // Invalidate name field
    producto.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Producto
        agent.post('/api/productos')
          .send(producto)
          .expect(400)
          .end(function (productoSaveErr, productoSaveRes) {
            // Set message assertion
            (productoSaveRes.body.message).should.match('Please fill Producto name');

            // Handle Producto save error
            done(productoSaveErr);
          });
      });
  });

  it('should be able to update an Producto if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Producto
        agent.post('/api/productos')
          .send(producto)
          .expect(200)
          .end(function (productoSaveErr, productoSaveRes) {
            // Handle Producto save error
            if (productoSaveErr) {
              return done(productoSaveErr);
            }

            // Update Producto name
            producto.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Producto
            agent.put('/api/productos/' + productoSaveRes.body._id)
              .send(producto)
              .expect(200)
              .end(function (productoUpdateErr, productoUpdateRes) {
                // Handle Producto update error
                if (productoUpdateErr) {
                  return done(productoUpdateErr);
                }

                // Set assertions
                (productoUpdateRes.body._id).should.equal(productoSaveRes.body._id);
                (productoUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Productos if not signed in', function (done) {
    // Create new Producto model instance
    var productoObj = new Producto(producto);

    // Save the producto
    productoObj.save(function () {
      // Request Productos
      request(app).get('/api/productos')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Producto if not signed in', function (done) {
    // Create new Producto model instance
    var productoObj = new Producto(producto);

    // Save the Producto
    productoObj.save(function () {
      request(app).get('/api/productos/' + productoObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', producto.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Producto with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/productos/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Producto is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Producto which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Producto
    request(app).get('/api/productos/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Producto with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Producto if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Producto
        agent.post('/api/productos')
          .send(producto)
          .expect(200)
          .end(function (productoSaveErr, productoSaveRes) {
            // Handle Producto save error
            if (productoSaveErr) {
              return done(productoSaveErr);
            }

            // Delete an existing Producto
            agent.delete('/api/productos/' + productoSaveRes.body._id)
              .send(producto)
              .expect(200)
              .end(function (productoDeleteErr, productoDeleteRes) {
                // Handle producto error error
                if (productoDeleteErr) {
                  return done(productoDeleteErr);
                }

                // Set assertions
                (productoDeleteRes.body._id).should.equal(productoSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Producto if not signed in', function (done) {
    // Set Producto user
    producto.user = user;

    // Create new Producto model instance
    var productoObj = new Producto(producto);

    // Save the Producto
    productoObj.save(function () {
      // Try deleting Producto
      request(app).delete('/api/productos/' + productoObj._id)
        .expect(403)
        .end(function (productoDeleteErr, productoDeleteRes) {
          // Set message assertion
          (productoDeleteRes.body.message).should.match('User is not authorized');

          // Handle Producto error error
          done(productoDeleteErr);
        });

    });
  });

  it('should be able to get a single Producto that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Producto
          agent.post('/api/productos')
            .send(producto)
            .expect(200)
            .end(function (productoSaveErr, productoSaveRes) {
              // Handle Producto save error
              if (productoSaveErr) {
                return done(productoSaveErr);
              }

              // Set assertions on new Producto
              (productoSaveRes.body.name).should.equal(producto.name);
              should.exist(productoSaveRes.body.user);
              should.equal(productoSaveRes.body.user._id, orphanId);

              // force the Producto to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Producto
                    agent.get('/api/productos/' + productoSaveRes.body._id)
                      .expect(200)
                      .end(function (productoInfoErr, productoInfoRes) {
                        // Handle Producto error
                        if (productoInfoErr) {
                          return done(productoInfoErr);
                        }

                        // Set assertions
                        (productoInfoRes.body._id).should.equal(productoSaveRes.body._id);
                        (productoInfoRes.body.name).should.equal(producto.name);
                        should.equal(productoInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Producto.remove().exec(done);
    });
  });
});
