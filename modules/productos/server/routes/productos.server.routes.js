'use strict';

/**
 * Module dependencies
 */
var productosPolicy = require('../policies/productos.server.policy'),
  productos = require('../controllers/productos.server.controller'),
  multiparty = require('connect-multiparty'),
  multipartyMiddleware = multiparty();

module.exports = function(app) {
  // Productos Routes
  app.route('/api/productos').all(productosPolicy.isAllowed)
    .get(productos.list)
    .post(productos.create);

  app.route('/api/productos/:productoId').all(productosPolicy.isAllowed)
    .get(productos.read)
    .put(productos.update)
    .delete(productos.delete);

  app.route('/uploads/img').all(productosPolicy.isAllowed)
    .post(multipartyMiddleware, productos.upload);

  // Finish by binding the Producto middleware
  app.param('productoId', productos.productoByID);
 
};
