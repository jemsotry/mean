'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'), 
  Producto = mongoose.model('Producto'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Producto
 */
exports.create = function(req, res) {
  var producto = new Producto(req.body);
  producto.user = req.user;

  producto.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(producto);
    }
  });
};

/**
 * Show the current Producto
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var producto = req.producto ? req.producto.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  producto.isCurrentUserOwner = req.user && producto.user && producto.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(producto);
};

/**
 * Update a Producto
 */
exports.update = function(req, res) {
  var producto = req.producto ;

  producto = _.extend(producto , req.body);

  producto.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(producto);
    }
  });
};

/**
 * Delete an Producto
 */
exports.delete = function(req, res) {
  var producto = req.producto ;

  producto.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(producto);
    }
  });
};

/**
 * List of Productos
 */
exports.list = function(req, res) {
  var count = req.query.count || 2;
  var start = req.query.page || 0;

  var filter = {
    filters : {
      mandatory : {
        contains : req.query.filter
      }
    }
  };

  var pagination = {
    start : start,
    count : count// numero de registros a obtener en la consulta
  };

  var sort = {
    sort : {
      desc : '_id'
    }
  };

  Producto
    .find().filter(filter)
    .order(sort)
    .page(pagination, function(err,productos){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(productos);
      }
    });
  /*Producto.find().sort('-created').populate('user', 'displayName').exec(function(err, productos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productos);
    }
  });*/
};
/*exports.list = function(req, res) { 
  Producto.find().sort('-created').populate('user', 'displayName').exec(function(err, productos) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(productos);
    }
  });
};*/


/**
 * Producto middleware
 */
exports.productoByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Producto is invalid'
    });
  }

  Producto.findById(id).populate('user', 'displayName').exec(function (err, producto) {
    if (err) {
      return next(err);
    } else if (!producto) {
      return res.status(404).send({
        message: 'No Producto with that identifier has been found'
      });
    }
    req.producto = producto;
    next();
  });
};



/**
 * Producto middleware
 */
exports.find = function(req, res, next, field) {

  /*if (!mongoose.Types.String(field)) {
    return res.status(400).send({
      message: 'Producto is invalido'
    });
  }*/

  Producto.findById(field).populate('user', 'displayName').exec(function (err, producto) {
    if (err) {
      return next(err);
    } else if (!producto) {
      return res.status(404).send({
        message: 'No Producto with that identifier has been found'
      });
    }
    req.producto = producto;
    next();
  });



};
