'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'), 
  Producto = mongoose.model('Producto'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  fs = require('fs');




/**
 * Create a Producto
 */
exports.upload = function(req, res) {
  var existError = false;
  var msgRes = 'OK';
  var files = req.files.file;
  console.log('UPLOAD');
  try {
    if (files !== null) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];

        var path = require('path');
        var filename = file.name;

        var name = path.join('modules/productos/client/img/', filename);

        var base64Image = fs.readFileSync(file.path).toString('base64');

        fs.writeFileSync(name, base64Image, 'base64');
      
      }
    }
  } catch (e) {
    console.log('...Error writing file' + e.message);
    msgRes = e.message;
    existError = true;
  }
  if (existError) {
    return res.status(404).send({
      message: msgRes
    });
  } else {
    return res.status(200).send({
      message: msgRes
    });
  }
};


/**
 * Create a Producto
 */
exports.create = function(req, res) {
  var producto = new Producto(req.body);
  var images = [];

  producto.user = req.user;

 /*
  FUNCIONA
  var files = req.files.file;
 
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var path = require('path');
    var filename = file.name;

    var name = path.join('modules/productos/client/img/', filename);
    images.push(name);

    var base64Image = fs.readFileSync(file.path).toString('base64');

    fs.writeFileSync(name, base64Image, 'base64');



    */


    // FUNCIONA
    //var base64Image = fs.readFileSync(file.path).toString('base64');

    /*fs.writeFile(name, base64Image, 'base64', function (err) {
        if (err) throw err;
        console.log('It\'s saved! in same location.');
    });*/



    /*var path = '/modules/productos/client/img/' + file.name;
    fs.writeFile("./client/img/", file, 'utf8', function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    }); */

    //var base64Image = fs.readFileSync(file.path).toString('base64');
    //fs.unlinkSync(file.path);
    /*fs.unlink(file.path, function (err) {
      if (err){ 
        console.log('failed to delete ' + file.path);
      }
      else{
        console.log('successfully deleted ' + file.path);
      }
    });*/
    //images.push(base64Image);
    //images.push(path);

    /*fs.readFile(file.path, function (err,original_data) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } 
      // save image in db as base64 encoded - this limits the image size
      // to there should be size checks here and in client
      var base64Image = original_data.toString('base64');
      //console.log(base64Image);
      fs.unlink(file.path, function (err) {
        if (err){ 
          console.log('failed to delete ' + file.path);
        }
        else{
          console.log('successfully deleted ' + file.path);
        }
      });
      images.push(base64Image);
      //producto.images = images;
      if (images.length === files.length) {
        producto.images = images;
        console.log('images ' + images.length);

        return;
      }
    });*/
  //}
  //console.log('images process' + images.length);
  // Add all base 64 images
  //console.log('array ' + images);
  //console.log('array size ' + images.length);

  //producto.images = images;

  
  // final operation to save
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

function readFile (file, res) {
  var base64Image;
  fs.readFile(file.path, function (err,original_data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } 
    // save image in db as base64 encoded - this limits the image size
    // to there should be size checks here and in client
    //base64Image = original_data.toString('base64');
      //console.log(base64Image);
    fs.unlink(file.path, function (err) {
      if (err){ 
        console.log('failed to delete ' + file.path);
      }
      else{
        console.log('successfully deleted ' + file.path);
      }
    });
    /*if (images.length === files.length) {
      producto.images = images;
      console.log('images ' + images.length);
      break;
    }*/
  });
  //console.log(base64Image);
  //return base64Image;
}

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
  var producto = req.producto;
  var images = [];

  producto = _.extend(producto , req.body);

  /*var files = req.files.file;

  if (files !== null) {
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      console.log('name ' + file.name);
      console.log('path ' + file.path);
      var base64Image = fs.readFileSync(file.path).toString('base64');
      fs.unlinkSync(file.path);

      images.push(base64Image);

    }
    console.log('images process' + images.length);

    producto.images = images;
  }*/

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
