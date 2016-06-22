'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
/**
 * Producto Schema
 */
var ProductoSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Producto name',
    trim: true
  },
  descripcion: {
    type: String,
    default: '',
    required: 'Please fill Producto decripcion',
    trim: true
  },
  precio: {
    type: String,
    default: '',
    required: 'Please fill Producto precio',
    trim: true
  },
  quantity: {
    type: String,
    default: '0',
    required: 'Please fill Producto quantity',
    trim: true
  },
  images: [{
    type: String,
    default: '',
  }],
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Producto', ProductoSchema);
require('mongoose-middleware').initialize(mongoose);
